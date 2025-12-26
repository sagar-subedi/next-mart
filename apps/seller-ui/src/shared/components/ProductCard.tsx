'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiHeartLine, RiHeartFill, RiShoppingBag3Line } from 'react-icons/ri';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import Ratings from './Ratings';

interface Props {
  product: any;
  isEvent?: boolean;
}

const ProductCard = ({ product, isEvent = false }: Props) => {
  const [timeLeft, setTimeLeft] = useState('');
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

        setTimeLeft(`${days}d ${hours}h ${minutes}m left with this price`);
      }, 60000);
      return () => clearInterval(interval);
    }
    return;
  }, [isEvent, product?.endingDate]);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const wishlist = useStore((state) => state.wishlist);
  const cart = useStore((state) => state.cart);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="group bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-800 flex flex-col h-full relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isEvent && (
          <div className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20 uppercase tracking-wider">
            Offer
          </div>
        )}
        {product?.stock <= 5 && (
          <div className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-amber-400/20 uppercase tracking-wider">
            Low Stock
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <Link href={`/dashboard/products/${product?.slug}`}>
          <Image
            src={product?.images[0]?.fileUrl}
            alt={product?.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out p-4"
          />
        </Link>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 ease-out">
          <button
            onClick={() => {
              if (isWishlisted) {
                removeFromWishlist(product.id, user, location, deviceInfo);
              } else {
                addToWishlist({ ...product, quantity: 1 }, user, location, deviceInfo);
              }
            }}
            className="w-9 h-9 bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors border border-slate-700"
          >
            {isWishlisted ? (
              <RiHeartFill size={18} className="text-red-500 scale-110" />
            ) : (
              <RiHeartLine size={18} className="text-slate-400" />
            )}
          </button>
          <button
            onClick={() => {
              !isInCart && addToCart({ ...product, quantity: 1 }, user, location, deviceInfo);
            }}
            className="w-9 h-9 bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RiShoppingBag3Line size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          href={`/shops/${product.shop?.id}`}
          className="text-brand-primary-500 text-[10px] font-bold uppercase tracking-widest mb-1 hover:text-brand-primary-400 transition-colors"
        >
          {product.shop?.name}
        </Link>

        <Link href={`/dashboard/products/${product?.slug}`} className="mb-2">
          <h3 className="text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-brand-primary-500 transition-colors leading-tight">
            {product?.title}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-3">
            <Ratings rating={product?.ratings} />
            <span className="text-[10px] text-slate-400 font-medium">({product?.ratings || 0})</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-black text-white leading-none">
                ${product.salePrice}
              </span>
              <span className="text-[10px] line-through text-slate-400 font-medium">
                ${product.regularPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {product.totalSales} sold
              </span>
            </div>
          </div>

          {isEvent && timeLeft && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 uppercase tracking-tight">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {timeLeft}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
