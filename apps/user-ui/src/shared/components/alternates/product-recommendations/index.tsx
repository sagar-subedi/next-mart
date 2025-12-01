'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../../../../store';
import axiosInstance from '../../../../utils/axiosInstance';
import SmartImage from '../smart-image';

interface ProductRecommendation {
  id: string;
  name: string;
  brand?: string;
  regular_price: number;
  sale_price?: number;
  ratings: number;
  category: string;
  subCategory: string;
  productImages: Array<{
    id: string;
    url: string;
  }>;
  seller?: {
    id: string;
    name: string;
    shop?: {
      id: string;
      name: string;
    };
  };
}

interface ApiResponse {
  success: boolean;
  data: {
    products: ProductRecommendation[];
  };
}

interface ProductRecommendationsProps {
  currentProductCategory: string;
  currentProductId: string;
  onProductClick: (product: any) => void;
  isStandalone?: boolean; // 是否为独立页面
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  currentProductCategory,
  currentProductId,
  onProductClick,
  isStandalone = false
}) => {
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { addToWishlist, removeFromWishlist, wishlist, addToCart, removeFromCart, cart } = useStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentProductCategory) {
        console.log('No category provided, skipping recommendations fetch');
        return;
      }

      console.log('Fetching recommendations for category:', currentProductCategory);

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Making API call to:', '/product/public-products');
        console.log('🔍 With params:', { category: currentProductCategory, limit: 6, page: 1 });

        const response = await axiosInstance.get<ApiResponse>('/product/public-products', {
          params: {
            category: currentProductCategory,
            limit: 6, // Limit to 6 recommendations
            page: 1
          }
        });

        console.log('Recommendations API response:', response.data);

        if (response.data.success) {
          // Filter out the current product and get up to 6 recommendations
          const filteredRecommendations = response.data.data.products
            .filter((product: ProductRecommendation) => product.id !== currentProductId)
            .slice(0, 6);

          console.log('Filtered recommendations:', filteredRecommendations);
          setRecommendations(filteredRecommendations);
        } else {
          console.error('API returned success: false:', response.data);
          setError('Failed to fetch recommendations');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductCategory, currentProductId, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const handleWishlistToggle = (product: ProductRecommendation) => {
    const storeProduct = {
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.sale_price || product.regular_price,
      image: product.productImages?.[0]?.url || '',
      shopId: product.seller?.shop?.id || ''
    };

    const isInWishlist = wishlist.some(item => item.id === product.id);

    if (isInWishlist) {
      removeFromWishlist(product.id, null, null, 'web');
    } else {
      addToWishlist(storeProduct, null, null, 'web');
    }
  };

  const handleCartToggle = (product: ProductRecommendation) => {
    const storeProduct = {
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.sale_price || product.regular_price,
      image: product.productImages?.[0]?.url || '',
      shopId: product.seller?.shop?.id || ''
    };

    const isInCart = cart.some(item => item.id === product.id);

    if (isInCart) {
      const removedProduct = cart.find(item => item.id === product.id);
      if (removedProduct) {
        removeFromCart(product.id, null, null, 'web');
      }
    } else {
      addToCart(storeProduct, null, null, 'web');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = (regularPrice: number, salePrice?: number) => {
    if (!salePrice || salePrice >= regularPrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 rounded-xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-5 rounded-xl">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {isStandalone ? 'Related Products' : 'You May Also Like'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/30 p-3 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32 mb-3"></div>
                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-2/3 mb-2"></div>
                <div className="bg-gray-200 rounded h-6 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Debug info - show current state
  console.log('ProductRecommendations render state:', {
    loading,
    error,
    recommendationsCount: recommendations.length,
    currentProductCategory,
    currentProductId
  });

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 rounded-xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-5 rounded-xl">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10 text-center py-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-2">Unable to load recommendations</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:scale-105 text-white rounded-full font-medium transition-all duration-200 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 rounded-xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-5 rounded-xl">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isStandalone ? 'Related Products' : 'You May Also Like'}
          </h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-2">No similar products found</p>
            <p className="text-gray-500 text-sm">We couldn't find any products in the same category at the moment.</p>
          </div>

          {/* Show sample recommendations when no products found */}
          <div className="mt-6">
            <p className="text-gray-600 text-sm mb-4">Here are some sample products you might like:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <div className="bg-gray-200 rounded-lg h-24 mb-2"></div>
                  <div className="bg-gray-200 rounded h-3 mb-1"></div>
                  <div className="bg-gray-200 rounded h-3 w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 rounded-xl p-6 shadow-lg border border-white/20 backdrop-blur-sm animate-fade-in">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-5 rounded-xl">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {isStandalone ? 'Related Products' : 'You May Also Like'}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {recommendations.map((product, index) => {
            const isInWishlist = wishlist.some(item => item.id === product.id);
            const isInCart = cart.some(item => item.id === product.id);
            const discountPercentage = getDiscountPercentage(product.regular_price, product.sale_price);

            return (
              <div
                key={product.id}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-lg border border-white/30 hover:border-blue-300 hover:shadow-lg transition-all duration-300 p-3 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onProductClick(product)}
              >
                <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-3 aspect-square">
                  <SmartImage
                    src={product.productImages?.[0]?.url || ''}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    fill
                  />

                  {/* Discount badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600 hover:text-red-500'
                        }`}
                    />
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1 font-medium">
                        {product.ratings.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {product.sale_price && product.sale_price < product.regular_price ? (
                      <>
                        <span className="font-bold text-gray-900 text-sm">
                          {formatPrice(product.sale_price)}
                        </span>
                        <span className="text-gray-400 text-xs line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900 text-sm">
                        {formatPrice(product.regular_price)}
                      </span>
                    )}
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCartToggle(product);
                    }}
                    className={`w-full mt-3 py-2 px-3 text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${isInCart
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      }`}
                  >
                    <ShoppingCart className="w-3 h-3 inline mr-1" />
                    {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
