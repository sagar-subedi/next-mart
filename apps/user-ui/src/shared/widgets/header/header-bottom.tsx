'use client';

import { navItems } from 'apps/user-ui/src/configs/constants';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import {
  AlignLeft,
  ChevronDown,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const HeaderBottom = () => {
  const [show, setShow] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${isSticky
          ? 'fixed top-0 left-0 z-[100] bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'relative bg-transparent'
        }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300 ${isSticky ? 'py-3' : 'py-2'
          }`}
      >
        {/* All Departments Dropdown */}
        <div className="relative">
          <button
            className={`flex items-center justify-between gap-3 px-6 py-3 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 hover:from-brand-primary-600 hover:to-brand-highlight-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${isSticky ? 'rounded-b-none' : ''
              }`}
            onClick={() => setShow(!show)}
          >
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              <span className="hidden md:inline">All Departments</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${show ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown menu */}
          {show && (
            <div
              className={`absolute left-0 ${isSticky ? 'top-[52px]' : 'top-[52px]'
                } w-64 max-h-96 bg-white/95 backdrop-blur-md shadow-xl rounded-b-xl border border-gray-200/50 overflow-y-auto z-50 animate-slideDown`}
            >
              <div className="p-2">
                <div className="text-sm text-gray-500 px-3 py-2">Coming soon...</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item: NavItemTypes, index: number) => (
            <Link
              href={item.href}
              key={index}
              className="px-5 py-2 font-medium text-gray-700 hover:text-brand-primary-600 hover:bg-white/60 rounded-lg transition-all duration-300 relative group"
            >
              {item.title}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Sticky Header User Actions */}
        {isSticky && (
          <div className="flex items-center gap-3">
            {!isLoading && user ? (
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 transition-all duration-300"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 border-2 border-white shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden xl:block">
                  <span className="block text-xs text-gray-600">Hello,</span>
                  <span className="font-semibold text-sm text-gray-900">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 transition-all duration-300"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-white shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden xl:block">
                  <span className="block text-xs text-gray-600">Hello,</span>
                  <span className="font-semibold text-sm text-gray-900">
                    {isLoading ? '...' : 'Sign In'}
                  </span>
                </div>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg hover:bg-white/60 transition-all duration-300"
            >
              <Heart className="w-5 h-5 text-gray-700 hover:text-pink-500 transition-colors" />
              {wishlist.length > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center border border-white shadow-sm">
                  <span className="text-white font-bold text-[10px]">
                    {wishlist.length}
                  </span>
                </div>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-white/60 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-brand-primary-500 transition-colors" />
              {cart.length > 0 && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-brand-primary-500 to-brand-highlight-500 rounded-full flex items-center justify-center border border-white shadow-sm">
                  <span className="text-white font-bold text-[10px]">
                    {cart.length}
                  </span>
                </div>
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HeaderBottom;
