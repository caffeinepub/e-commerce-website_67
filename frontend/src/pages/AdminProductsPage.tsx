import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ArrowLeft, Package, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminProductForm from '../components/AdminProductForm';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  useGetAllProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useIsCallerAdmin,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Product } from '../backend';

export default function AdminProductsPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const isAuthenticated = !!identity;
  const isSubmitting = addProduct.isPending || updateProduct.isPending;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(product);
        toast.success('Product updated successfully!');
      } else {
        await addProduct.mutateAsync(product);
        toast.success('Product added successfully!');
      }
      setFormOpen(false);
      setEditingProduct(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <ShieldAlert className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold font-display">Access Restricted</h1>
            <p className="text-muted-foreground">Please log in to access the admin panel.</p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Loading admin status
  if (adminLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold font-display">Access Denied</h1>
            <p className="text-muted-foreground">You don't have admin privileges to manage products.</p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold font-display flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  Manage Products
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {products?.length ?? 0} product{(products?.length ?? 0) !== 1 ? 's' : ''} in catalog
                </p>
              </div>
            </div>
            <Button onClick={handleOpenAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Products Table */}
          {productsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">No products yet</h2>
              <p className="text-muted-foreground mb-6">Add your first product to get started.</p>
              <Button onClick={handleOpenAdd} className="gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40">
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Stock</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-secondary/20 transition-colors">
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary/40 border border-border flex-shrink-0">
                          <img
                            src={product.image.getDirectURL()}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm leading-tight">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        ${(Number(product.price) / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={Number(product.stock) === 0 ? 'text-destructive font-medium' : 'text-foreground'}>
                          {Number(product.stock)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{'★'.repeat(Number(product.rating))}{'☆'.repeat(5 - Number(product.rating))}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEdit(product)}
                            title="Edit product"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteTarget(product)}
                            disabled={deleteProduct.isPending && deleteTarget?.id === product.id}
                            title="Delete product"
                          >
                            {deleteProduct.isPending && deleteTarget?.id === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Add / Edit Product Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => { if (!open && !isSubmitting) { setFormOpen(false); setEditingProduct(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <AdminProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => { setFormOpen(false); setEditingProduct(null); }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
