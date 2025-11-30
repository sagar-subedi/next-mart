'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Heart, Search, ShoppingCart, User, Sparkles } from 'lucide-react';
import Logo from 'apps/user-ui/src/assets/svgs/Logo';
import HeaderBottom from './header-bottom';
import useUser from 'apps/user-ui/src/hooks/useUser';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { useStore } from 'apps/user-ui/src/store';
import useLayout from 'apps/user-ui/src/hooks/useLayout';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  points?: number;
}

const Header = () => {
  const { user, isLoading } = useUser() as {
    user: User | null;
    isLoading: boolean;
  };
  const { layout } = useLayout();
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleSearchClick = async () => {
    if (!searchQuery.trim()) return;
    setIsLoadingSuggestions(true);

    try {
      const response = await axiosInstance.get(
        `/products/search-products?q=${encodeURIComponent(searchQuery)}`
      );
      setSuggestions(response.data.products.slice(0, 10));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block transition-transform hover:scale-105 duration-300">
              {layout?.logo ? (
                <Image
                  src={layout.logo}
                  alt="logo"
                  width={120}
                  height={40}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
              )}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative group">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands, and more..."
                className="w-full px-5 py-3.5 pr-14 font-medium border-2 border-brand-primary-200 hover:border-brand-primary-300 focus:border-brand-primary-500 outline-none rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchClick();
                }}
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            {!isLoading && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/60 transition-all duration-300 group"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block">
                  <span className="block text-xs text-gray-600 font-medium">Hello,</span>
                  <span className="font-semibold text-gray-900">{user.name.split(' ')[0]}</span>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/60 transition-all duration-300 group"
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block">
                  <span className="block text-xs text-gray-600 font-medium">Hello,</span>
                  <span className="font-semibold text-gray-900">
                    {isLoading ? '...' : 'Sign In'}
                  </span>
                </div>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-3 rounded-xl hover:bg-white/60 transition-all duration-300 group"
            >
              <Heart className="w-6 h-6 text-gray-700 group-hover:text-pink-500 transition-colors duration-300" />
              {wishlist.length > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-white font-bold text-xs">
                    {wishlist.length}
                  </span>
                </div>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-3 rounded-xl hover:bg-white/60 transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-brand-primary-500 transition-colors duration-300" />
              {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  <span className="text-white font-bold text-xs">
                    {cart.length}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200/50">
        <HeaderBottom />
      </div>
    </header>
  );
};

export default Header;
