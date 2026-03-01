import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, CartItem, Order, UserProfile } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useSearchProducts(searchText: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchText],
    queryFn: async () => {
      if (!actor || !searchText.trim()) return [];
      return actor.searchProducts(searchText);
    },
    enabled: !!actor && !isFetching && !!searchText.trim(),
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Not connected');
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Not connected');
      const result = await actor.updateProduct(product);
      if (!result) throw new Error('Product not found');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Not connected');
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ─── Admin Role ───────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['callerIsAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export function useGetCart() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<CartItem[]>({
    queryKey: ['cart', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCart();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      if (!actor) throw new Error('Not connected');
      return actor.addCartItem(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Not connected');
      return actor.updateCartItemQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', identity?.getPrincipal().toString()] });
    },
  });
}

export function useRemoveCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Not connected');
      return actor.removeCartItem(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', identity?.getPrincipal().toString()] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Not connected');
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', identity?.getPrincipal().toString()] });
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (totalAmount: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.placeOrder(totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Order[]>({
    queryKey: ['orders', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyOrders();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Not connected');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile', identity?.getPrincipal().toString()] });
    },
  });
}
