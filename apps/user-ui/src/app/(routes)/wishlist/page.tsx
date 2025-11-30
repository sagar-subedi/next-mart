'use client';

import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import EmptyState from 'apps/user-ui/src/shared/components/EmptyState';

const Wishlist = () => {
  const wishlist = useStore((state) => state.wishlist);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const { user } = useUser();
  const { location } = useLocationTracking();
  const { deviceInfo } = useDeviceTracking();

  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromWishlist(id, user, location, deviceInfo);
  };

  return (
    <div className="bg-[#f5f5f5] w-full min-h-screen">
      <div className="md:w-[80%] w-[95%] mx-auto py-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <div className="flex items-center gap-1 text-sm mb-8">
            <Link href="/" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex justify-center">
            <EmptyState
              title="Your wishlist is empty"
              message="Save your favorite products for later!"
              icon={Heart}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={item.images[0]?.fileUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    onClick={() => removeItem(item.id)}
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="text-xl font-bold text-brand-primary-600">
                      ${item.salePrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        className="p-2 hover:bg-gray-50 transition-colors"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-medium text-sm">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-50 transition-colors"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-600 transition-colors font-medium text-sm"
                      onClick={() => addToCart(item, user, location, deviceInfo)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
