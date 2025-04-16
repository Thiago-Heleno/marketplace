"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  Row, // Import Row type
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteProduct,
  type VendorProductListItem,
} from "@/actions/product.actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Helper function to format currency
const formatCurrency = (amountInCents: number | null) => {
  if (amountInCents === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // TODO: Make currency configurable
  }).format(amountInCents / 100);
};

// Helper function to format dates
const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// --- Actions Cell Component ---
interface ProductActionsCellProps {
  row: Row<VendorProductListItem>; // Pass the full row
}

const ProductActionsCell: React.FC<ProductActionsCellProps> = ({ row }) => {
  const product = row.original;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false); // Prevent closing during confirm

  const handleDelete = async () => {
    // Prevent menu from closing
    setIsMenuOpen(true);

    // Confirmation dialog
    if (
      !confirm(
        `Are you sure you want to delete the product "${product.title}"? This action cannot be undone.`
      )
    ) {
      setIsMenuOpen(false); // Allow menu to close if cancelled
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        toast.success(result.message || "Product deleted successfully!");
        router.refresh(); // Refresh data on the current page
        // No need to manually close menu here, refresh will unmount it
      } else {
        toast.error(result.error || "Failed to delete product.");
        setIsMenuOpen(false); // Allow menu to close on error
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
      console.error("Delete product error:", error);
      setIsMenuOpen(false); // Allow menu to close on error
    } finally {
      // Only set deleting to false if it hasn't succeeded (and unmounted)
      // This state might not even be reached if refresh() is fast enough
      if (document.getElementById(`action-menu-${product.id}`)) {
        // Check if element still exists
        setIsDeleting(false);
      }
    }
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          data-testid={`product-actions-trigger-${product.id}`} // Added data-testid
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" id={`action-menu-${product.id}`}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.id)}
        >
          Copy product ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/vendor/products/edit/${product.id}`}
            data-testid={`product-edit-action-${product.id}`} // Added data-testid
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 focus:bg-red-100"
          data-testid={`product-delete-action-${product.id}`} // Added data-testid
          onClick={(e: React.MouseEvent) => {
            // Added type for event
            e.preventDefault(); // Prevent menu closing immediately
            handleDelete();
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- Define Table Columns ---
export const columns: ColumnDef<VendorProductListItem>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | null;
      const title = row.original.title;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={40}
          height={40}
          className="rounded object-cover aspect-square"
        />
      ) : (
        <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center text-muted-foreground text-xs">
          No img
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "priceInCents",
    header: "Price",
    cell: ({ row }) => (
      <div>{formatCurrency(row.getValue("priceInCents"))}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <div>{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isActive") ? "default" : "outline"}>
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    // Render the dedicated component for actions
    cell: ({ row }) => <ProductActionsCell row={row} />,
  },
];

// --- Main Table Component ---
interface VendorProductTableProps {
  data: VendorProductListItem[];
}

export function VendorProductTable({ data }: VendorProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          data-testid="vendor-products-filter-input" // Added data-testid
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  data-testid={`product-row-${row.original.id}`} // Added data-testid
                >
                  {row.getVisibleCells().map((cell) => {
                    // Determine testId based on column
                    let testId = undefined;
                    const productId = row.original.id;
                    switch (cell.column.id) {
                      case "title":
                        testId = `product-title-cell-${productId}`;
                        break;
                      case "isActive":
                        testId = `product-status-cell-${productId}`;
                        break;
                      case "priceInCents":
                        testId = `product-price-cell-${productId}`;
                        break;
                      case "stock":
                        testId = `product-stock-cell-${productId}`;
                        break;
                    }
                    return (
                      <TableCell key={cell.id} data-testid={testId}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                  data-testid="vendor-products-empty-message" // Added data-testid
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
