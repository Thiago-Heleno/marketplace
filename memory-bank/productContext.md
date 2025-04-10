# Product Context: Multi-Vendor Marketplace

**Version:** 1.0
**Date:** 30/03/2025
**Based on:** `projectbrief.md` v1.0

## 1. Purpose & Problem Solved

This project aims to create a functional online marketplace where multiple vendors can sell digital and physical products. It addresses the need for a platform that facilitates:

- **For Vendors:** Easy registration (with approval), product listing (including variations), inventory management, order fulfillment tracking, and a clear withdrawal process for earnings.
- **For Customers:** A seamless browsing, searching, and purchasing experience for both digital and physical goods, along with order tracking and secure access to digital purchases.
- **For Affiliates:** A system to generate referral codes, track commissions earned from referred sales, and request withdrawals.
- **For Admins:** Oversight capabilities for approving users (vendors/affiliates) and managing withdrawal requests.

The core problem is providing a centralized, reliable, and secure platform connecting vendors, customers, and affiliates within a single marketplace ecosystem, focusing initially on an MVP.

## 2. Target Users & Experience Goals

- **Customers:** Seek a user-friendly interface to discover and purchase diverse products. Expect clear product information, a simple checkout process (Stripe), reliable order tracking, and secure access to digital downloads.
- **Vendors:** Need an intuitive dashboard to manage their products (CRUD, variants, stock, images, digital assets), track orders assigned to them, manage fulfillment status, understand their earnings (post-commission), and request withdrawals via PIX. Require an approval step for registration.
- **Affiliates:** Need a simple way to register (with approval), generate unique referral codes, track the commissions earned from successful, fulfilled orders referred by them, and request withdrawals via PIX.
- **Admin:** Requires tools to manage the platform's integrity by approving/rejecting vendor and affiliate registrations and overseeing the manual withdrawal process.

**Overall Experience Goal:** A simple, reliable, and secure MVP experience for all user types, prioritizing core functionality over complex features for V1.

## 3. Key Functionality (User Perspective)

- **Browsing/Shopping:** Find products via categories or search, view details (variants, stock), add to cart, checkout via Stripe (handling physical item shipping address/cost), view order history, download digital items.
- **Selling (Vendor):** Register, manage product listings, manage inventory/variants, view and update fulfillment status for their order items, see calculated balance, request withdrawal.
- **Referring (Affiliate):** Register, generate code, track confirmed commissions, see calculated balance, request withdrawal.
- **Administering:** Approve users, view all orders/users, manage withdrawal requests.

_(Details derived from `projectbrief.md` Section 2 & 4)_
