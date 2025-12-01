'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../../store';
import useUser from '../../../../hooks/useUser';
import SmartImage from '../smart-image';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    description: string;
    regular_price: number;
    sale_price?: number;
    ratings: number;
    colors?: string[];
    sizes?: string[];
    category: string;
    subCategory: string;
    tags?: string;
    warranty: string;
    stock: number;
    custom_specification?: any;
    custom_attributes?: any;
    createdAt: string;
    status: string;
    productImages: Array<{
      id: string;
      url: string;
    }>;
    seller?: {
      id: string;
      name: string;
      email: string;
      shop?: {
        id: string;
        name: string;
        ratings: number;
        address: string;
        avatar?: {
          url: string;
        };
      };
    };
  };
  index?: number;
  onClick?: (product: ProductCardProps['product']) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, onClick }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // 获取当前用户信息
  const { user } = useUser();

  // 调试用户信息
  useEffect(() => {
    console.log('=== ProductCard user effect ===');
    console.log('User from useUser:', user);
    console.log('User ID:', user?.id);
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (!product.sale_price || product.sale_price >= product.regular_price) {
      return 0;
    }
    return Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100);
  };

  const discountPercentage = getDiscountPercentage();

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const { addToWishlist, removeFromWishlist, wishlist, addToCart, removeFromCart, cart } = useStore();

  // 检查产品是否已在愿望清单中
  useEffect(() => {
    const checkWishlistStatus = () => {
      const exists = wishlist.some(item => item.id === product.id);
      setIsInWishlist(exists);
    };

    checkWishlistStatus();
  }, [wishlist, product.id]);

  // 检查产品是否已在购物车中
  useEffect(() => {
    const checkCartStatus = () => {
      const exists = cart.some(item => item.id === product.id);
      setIsInCart(exists);
    };

    checkCartStatus();
  }, [cart, product.id]);

  // 处理愿望清单操作
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('=== handleWishlistToggle called ===');
    console.log('Product:', product);
    console.log('isInWishlist:', isInWishlist);
    console.log('Current user:', user);

    // 将 ProductCardProps 的 product 转换为 store 需要的 Product 类型
    const storeProduct = {
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.sale_price || product.regular_price,
      image: product.productImages?.[0]?.url || '',
      shopId: product.seller?.shop?.id || ''
    };

    console.log('Store product:', storeProduct);

    if (isInWishlist) {
      console.log('Removing from wishlist');
      const removedProduct = wishlist.find(item => item.id === product.id);
      if (removedProduct) {
        removeFromWishlist(product.id, user, null, 'web');
      }
    } else {
      console.log('Adding to wishlist');
      // 传递真实的用户信息
      addToWishlist(storeProduct, user, null, 'web');
    }
  };

  // 处理购物车操作
  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 将 ProductCardProps 的 product 转换为 store 需要的 Product 类型
    const storeProduct = {
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.sale_price || product.regular_price,
      image: product.productImages?.[0]?.url || '',
      shopId: product.seller?.shop?.id || ''
    };

    if (isInCart) {
      const removedProduct = cart.find(item => item.id === product.id);
      if (removedProduct) {
        removeFromCart(product.id, user, null, 'web');
      }
    } else {
      // 传递真实的用户信息
      addToCart(storeProduct, user, null, 'web');
    }
  };

  return (
    <div
      className="group bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 hover:shadow-2xl hover:border-white/50 hover:scale-105 transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={handleClick}
    >
      {/* 产品图片容器 */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-600 to-gray-700 overflow-hidden flex-shrink-0">
        <SmartImage
          src={product.productImages?.[0]?.url || ''}
          alt={product.name}
          category={product.category}
          className="w-full h-full group-hover:scale-105 transition-transform duration-200"
          fill
        />

        {/* 愿望清单按钮 */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm"
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* 折扣标签 */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* 热门标签 */}
        {index < 3 && (
          <div className="absolute top-12 right-2">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
              🔥 HOT
            </span>
          </div>
        )}

        {/* Prime标签 - 统一显示在左下角 */}
        {index < 5 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
              Prime
            </span>
          </div>
        )}
      </div>

      {/* 产品信息 */}
      <div className="p-4 flex-1 flex flex-col bg-gradient-to-br from-slate-600/80 to-gray-700/80">
        {/* 产品标题 */}
        <h3 className="font-medium text-white text-sm line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors duration-200 leading-tight">
          {product.name}
        </h3>

        {/* 品牌信息 */}
        {product.brand && (
          <p className="text-xs text-gray-200 mb-2">
            {product.brand}
          </p>
        )}

        {/* 评分 */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, starIndex) => (
              <svg
                key={starIndex}
                className={`w-3 h-3 ${starIndex < Math.round(product.ratings) ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-300 ml-1">
            ({product.ratings?.toFixed(1) || '0.0'})
          </span>
        </div>

        {/* 价格 */}
        <div className="flex items-center gap-2 mb-3">
          {product.sale_price && product.sale_price < product.regular_price ? (
            <>
              <span className="text-lg font-bold text-white">
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-sm text-gray-300 line-through">
                {formatPrice(product.regular_price)}
              </span>
              <span className="text-xs text-green-300 font-medium">
                Save {formatPrice(product.regular_price - product.sale_price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-white">
              {formatPrice(product.regular_price)}
            </span>
          )}
        </div>

        {/* 快速购买按钮 */}
        <button
          className={`w-full font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm mt-auto shadow-lg hover:shadow-xl ${isInCart
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900'
            }`}
          onClick={handleCartToggle}
        >
          {isInCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
