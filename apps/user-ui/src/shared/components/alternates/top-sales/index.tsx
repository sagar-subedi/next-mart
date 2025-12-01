'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Flame } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosInstance';
import SmartImage from '../smart-image';

interface Product {
  id: string;
  name: string;
  brand?: string;
  description: string;
  regular_price: number;
  sale_price?: number;
  ratings: number;
  category: string;
  subCategory: string;
  stock: number;
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
}

const TopSales = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取最畅销产品数据
  const fetchTopSales = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/product/public-products?limit=8');

      if ((response.data as any).success) {
        // 只显示有折扣的产品，然后按评分排序
        const discountedProducts = (response.data as any).data.products
          .filter((product: Product) => {
            return product.sale_price && product.sale_price < product.regular_price;
          })
          .sort((a: Product, b: Product) => (b.ratings || 0) - (a.ratings || 0))
          .slice(0, 8);
        setProducts(discountedProducts);
      } else {
        setError('Failed to fetch top sales');
      }
    } catch (err: any) {
      console.error('Error fetching top sales:', err);
      setError(err.response?.data?.message || 'Failed to fetch top sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopSales();
  }, []);

  // 处理产品卡片点击
  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  // 计算折扣百分比
  const getDiscountPercentage = (regularPrice: number, salePrice?: number) => {
    if (!salePrice || salePrice >= regularPrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden">
        {/* 动态背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-50/90 to-indigo-50/80"></div>

        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.2) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Sales</h2>
            <p className="text-lg text-gray-600">Best selling products with amazing discounts</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-16 overflow-hidden">
        {/* 动态背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-blue-50/90 to-indigo-50/80"></div>

        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.2) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">😔 {error}</div>
            <button
              onClick={fetchTopSales}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:scale-105 text-white rounded-full font-medium transition-all duration-200 shadow-lg"
            >
              <span>Retry</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 overflow-hidden bg-slate-900">
      {/* 动态背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-blue-800/70 to-indigo-800/60"></div>

      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '45px 45px'
        }}></div>
      </div>

      {/* 浮动光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-56 h-56 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-slate-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Top Sales</h2>
          </div>
          <p className="text-lg text-slate-300">Best selling products with amazing discounts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const discountPercentage = getDiscountPercentage(product.regular_price, product.sale_price);
            const hasDiscount = discountPercentage > 0;

            return (
              <div
                key={product.id}
                className="bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl hover:border-white/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleProductClick(product)}
              >
                {/* 产品图片 */}
                <div className="relative h-48 bg-gradient-to-br from-slate-600 to-gray-700">
                  <SmartImage
                    src={product.productImages?.[0]?.url || ''}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full"
                    fill
                  />

                  {/* 排名徽章 */}
                  <div className="absolute top-3 left-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* 折扣标签 */}
                  {hasDiscount && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                        -{discountPercentage}%
                      </div>
                    </div>
                  )}

                  {/* 热销标签 */}
                  {index < 3 && (
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        HOT
                      </div>
                    </div>
                  )}
                </div>

                {/* 产品信息 */}
                <div className="p-4 bg-gradient-to-br from-slate-600/80 to-gray-700/80">
                  <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h3>

                  {/* 品牌 */}
                  {product.brand && (
                    <p className="text-xs text-gray-200 font-medium mb-2">{product.brand}</p>
                  )}

                  {/* 评分 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(product.ratings || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-300">({product.ratings?.toFixed(1) || '0.0'})</span>
                  </div>

                  {/* 价格 */}
                  <div className="flex items-center gap-2 mb-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-bold text-white">
                          ${product.sale_price?.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-300 line-through">
                          ${product.regular_price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-white">
                        ${product.regular_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* 商店信息 */}
                  {product.seller?.shop && (
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                        {product.seller.shop.avatar?.url ? (
                          <img
                            src={product.seller.shop.avatar.url}
                            alt={product.seller.shop.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300"></div>
                        )}
                      </div>
                      <span className="truncate">{product.seller.shop.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopSales;
