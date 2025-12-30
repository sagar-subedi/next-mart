'use client';

import Image from 'next/image';
import Link from 'next/link';
import Ratings from '../Ratings';
import { useEffect, useState } from 'react';
import { Eye, Heart, ShoppingBag, Clock } from 'lucide-react';
import ProductDetailsCard from './ProductDetailsCard';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';

interface Props {
  product: any;
  isEvent?: boolean;
}

const ProductCard = ({ product, isEvent = false }: Props) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { location } = useLocationTracking();
  const { deviceInfo } = useDeviceTracking();

  useEffect(() => {
    if (isEvent && product?.endingDate) {
      const interval = setInterval(() => {
        const now = Date.now();
        const eventDate = new Date(product.endingDate).getTime();
        const difference = eventDate - now;

        if (difference <= 0) {
          setTimeLeft('Expired');
          clearInterval(interval);
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }, 60000);
      return () => clearInterval(interval);
    }
    return;
  }, [isEvent, product?.endingDate]);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const wishlist = useStore((state) => state.wishlist);
  const cart = useStore((state) => state.cart);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="h-full relative group">
      {/* Gradient Glow Effect on Hover */}
      <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-brand-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <div className="relative w-full bg-white rounded-xl border border-gray-100 shadow-sm group-hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isEvent && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
              OFFER
            </span>
          )}
          {product?.stock <= 5 && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          <Link href={`/products/${product?.slug}`}>
            <Image
              src={product?.images[0]?.fileUrl || 'https://placehold.co/400x300/png?text=Product'}
              alt={product?.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>

          {/* Quick Actions - Slide in on hover */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-75">
            <button
              onClick={() => {
                if (isWishlisted) {
                  removeFromWishlist(product.id, user, location, deviceInfo);
                } else {
                  addToWishlist({ ...product, quantity: 1 }, user, location, deviceInfo);
                }
              }}
              className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-pink-50 transition-colors border border-gray-100"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart
                size={18}
                className={isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-700"}
              />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-blue-50 transition-colors border border-gray-100"
              title="Quick View"
            >
              <Eye size={18} className="text-gray-700" />
            </button>

            <button
              onClick={() => {
                if (isInCart) {
                  removeFromCart(product.id, user, location, deviceInfo);
                } else {
                  addToCart({ ...product, quantity: 1 }, user, location, deviceInfo);
                }
              }}
              className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-green-50 transition-colors border border-gray-100"
              title={isInCart ? "Remove from Cart" : "Add to Cart"}
            >
              <ShoppingBag
                size={18}
                className={isInCart ? "fill-green-500 text-green-500" : "text-gray-700"}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow relative">
          <Link
            href={`/shops/${product.shop?.id}`}
            className="text-xs text-brand-primary-500 font-bold uppercase tracking-wide hover:underline mb-1"
          >
            {product.shop?.name}
          </Link>

          <Link href={`/products/${product?.slug}`}>
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 hover:text-brand-primary-600 transition-colors h-10 leading-snug">
              {product?.title}
            </h3>
          </Link>

          <div className="mb-3">
            <Ratings rating={product?.ratings} />
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-gray-900">
                  ${product.salePrice}
                </span>
                {product.regularPrice > product.salePrice && (
                  <span className="text-xs line-through text-gray-400 font-medium">
                    ${product.regularPrice}
                  </span>
                )}
              </div>
              {isEvent && timeLeft && (
                <div className="flex items-center gap-1 text-[10px] text-orange-600 mt-1 font-bold bg-orange-50 px-2 py-0.5 rounded-full w-fit">
                  <Clock size={10} />
                  <span>{timeLeft}</span>
                </div>
              )}
            </div>

            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.totalSales} sold
            </span>
          </div>
        </div>

        {open && (
          <ProductDetailsCard open={open} setOpen={setOpen} data={product} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
