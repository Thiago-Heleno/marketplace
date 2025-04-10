"use client"; // This context needs to be client-side

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Define the structure of a cart item
export interface CartItem {
  productId: string;
  productVariantId: string; // Crucial for identifying the specific variant
  quantity: number;
  // Add other details fetched on demand or stored if needed (e.g., title, price, image)
  // For simplicity now, we only store IDs and quantity. Details fetched when displaying cart.
}

// Define the shape of the context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void; // Allow adding with specific quantity or default 1
  removeFromCart: (productVariantId: string) => void;
  updateQuantity: (productVariantId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productVariantId: string) => number;
  cartCount: number; // Total number of items in the cart
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("marketplaceCart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Basic validation to ensure it's an array
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.warn("Invalid cart data found in localStorage.");
          localStorage.removeItem("marketplaceCart"); // Clear invalid data
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("marketplaceCart"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("marketplaceCart", JSON.stringify(cartItems));
    } else {
      // Clear localStorage if cart becomes empty
      localStorage.removeItem("marketplaceCart");
    }
  }, [cartItems]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (i) => i.productVariantId === item.productVariantId
        );
        const addQuantity = item.quantity ?? 1; // Default to adding 1

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + addQuantity,
          };
          return updatedItems;
        } else {
          // Item doesn't exist, add new item
          return [...prevItems, { ...item, quantity: addQuantity }];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((productVariantId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productVariantId !== productVariantId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productVariantId: string, quantity: number) => {
      setCartItems((prevItems) => {
        if (quantity <= 0) {
          // If quantity is 0 or less, remove the item
          return prevItems.filter(
            (item) => item.productVariantId !== productVariantId
          );
        }
        // Otherwise, update the quantity
        return prevItems.map((item) =>
          item.productVariantId === productVariantId
            ? { ...item, quantity }
            : item
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productVariantId: string): number => {
      const item = cartItems.find(
        (i) => i.productVariantId === productVariantId
      );
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  // Calculate total number of items (sum of quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
