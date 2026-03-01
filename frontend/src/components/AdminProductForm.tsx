import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ExternalBlob } from '../backend';
import type { Product } from '../backend';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ProductFormValues {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  stock: string;
  rating: string;
}

interface AdminProductFormProps {
  product?: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Beauty',
  'Food',
  'Other',
];

export default function AdminProductForm({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AdminProductFormProps) {
  const isEditMode = !!product;

  const form = useForm<ProductFormValues>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      stock: '',
      rating: '0',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id,
        name: product.name,
        description: product.description,
        price: (Number(product.price) / 100).toFixed(2),
        category: product.category,
        imageUrl: product.image.getDirectURL(),
        stock: String(Number(product.stock)),
        rating: String(Number(product.rating)),
      });
    } else {
      form.reset({
        id: '',
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        stock: '',
        rating: '0',
      });
    }
  }, [product, form]);

  const handleSubmit = (values: ProductFormValues) => {
    const priceInCents = Math.round(parseFloat(values.price) * 100);
    const productData: Product = {
      id: isEditMode ? product!.id : (values.id.trim() || `prod-${Date.now()}`),
      name: values.name.trim(),
      description: values.description.trim(),
      price: BigInt(priceInCents),
      category: values.category.trim(),
      image: ExternalBlob.fromURL(values.imageUrl.trim()),
      stock: BigInt(parseInt(values.stock, 10)),
      rating: BigInt(Math.min(5, Math.max(0, parseInt(values.rating, 10)))),
    };
    onSubmit(productData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {!isEditMode && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product ID <span className="text-muted-foreground text-xs">(optional, auto-generated if empty)</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. prod-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Product name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product…" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            rules={{
              required: 'Price is required',
              validate: (v) => {
                const n = parseFloat(v);
                return (!isNaN(n) && n >= 0) || 'Enter a valid price';
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            rules={{
              required: 'Stock is required',
              validate: (v) => {
                const n = parseInt(v, 10);
                return (!isNaN(n) && n >= 0) || 'Enter a valid stock quantity';
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input list="category-list" placeholder="e.g. Electronics" {...field} />
                </FormControl>
                <datalist id="category-list">
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            rules={{
              required: 'Rating is required',
              validate: (v) => {
                const n = parseInt(v, 10);
                return (!isNaN(n) && n >= 0 && n <= 5) || 'Rating must be 0–5';
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0–5) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="5" step="1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          rules={{ required: 'Image URL is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('imageUrl') && (
          <div className="rounded-lg overflow-hidden border border-border h-32 bg-secondary/30">
            <img
              src={form.watch('imageUrl')}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Add Product'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
