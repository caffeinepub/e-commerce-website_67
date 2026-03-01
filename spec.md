# Specification

## Summary
**Goal:** Add a full product management interface for admin users, allowing them to create, edit, and delete products in the Amber Shop.

**Planned changes:**
- Add an admin product management page with a form to create new products (fields: name, description, price, category, image URL, stock quantity, rating)
- Add edit functionality with a pre-filled form to update existing product details
- Add delete functionality with a confirmation prompt before removing a product
- Show success/error toast notifications for all create, edit, and delete actions
- Display an "Add Product" or "Manage Products" link in the navbar visible only to admin-role users
- Add backend CRUD endpoints (create, update, delete) guarded by admin role checks
- Add React Query mutation hooks for createProduct, updateProduct, and deleteProduct in useQueries.ts, with automatic cache invalidation after mutations

**User-visible outcome:** Admin users can navigate to a product management page where they can add new products, edit existing ones, and delete products, with the store's product listing updating automatically after each change.
