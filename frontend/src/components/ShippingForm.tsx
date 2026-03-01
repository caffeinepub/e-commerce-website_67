import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Truck } from 'lucide-react';

export interface ShippingFormData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
  isSubmitting?: boolean;
}

export default function ShippingForm({ onSubmit, isSubmitting }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-lg text-foreground">Shipping Details</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register('fullName', { required: 'Full name is required' })}
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            placeholder="123 Main Street"
            {...register('address', { required: 'Address is required' })}
            className={errors.address ? 'border-destructive' : ''}
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="New York"
              {...register('city', { required: 'City is required' })}
              className={errors.city ? 'border-destructive' : ''}
            />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="10001"
              {...register('postalCode', {
                required: 'Postal code is required',
                pattern: { value: /^[A-Za-z0-9\s\-]{3,10}$/, message: 'Invalid postal code' }
              })}
              className={errors.postalCode ? 'border-destructive' : ''}
            />
            {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full mt-2 gap-2" disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Placing Order…</>
          ) : (
            'Place Order'
          )}
        </Button>
      </form>
    </div>
  );
}
