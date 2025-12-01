'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Users, TrendingUp } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosInstance';
import SmartImage from '../smart-image';

interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  ratings: number;
  coverBanner?: string;
  avatar?: {
    url: string;
  };
  followers?: string[];
  _count?: {
    products: number;
    reviews: number;
  };
}

const TopShops = () => {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取顶级商店数据
  const fetchTopShops = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/shops?limit=4');

      if ((response.data as any).success) {
        // 按评分排序并取前4个
        const sortedShops = (response.data as any).data.shops
          .sort((a: Shop, b: Shop) => (b.ratings || 0) - (a.ratings || 0))
          .slice(0, 4);
        setShops(sortedShops);
      } else {
        setError('Failed to fetch top shops');
      }
    } catch (err: any) {
      console.error('Error fetching top shops:', err);
      setError(err.response?.data?.message || 'Failed to fetch top shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopShops();
  }, []);

  // 处理商店卡片点击
  const handleShopClick = (shop: Shop) => {
    router.push(`/shops/${shop.id}`);
  };

  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden">
        {/* 动态背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/95 to-blue-50/90"></div>

        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.2) 1px, transparent 0)`,
            backgroundSize: '45px 45px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4"> Top Shops</h2>
            <p className="text-lg text-gray-600">Discover the most popular and highly-rated shops</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/95 to-blue-50/90"></div>

        {/* 动态网格背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.2) 1px, transparent 0)`,
            backgroundSize: '45px 45px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">😔 {error}</div>
            <button
              onClick={fetchTopShops}
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
    <section className="relative py-16 overflow-hidden bg-gray-900">
      {/* 动态背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-slate-700/70 to-blue-800/60"></div>

      {/* 动态网格背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* 浮动光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-24 w-60 h-60 bg-gradient-to-r from-slate-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 right-24 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-52 h-52 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Top Shops</h2>
          </div>
          <p className="text-lg text-slate-300">Discover the most popular and highly-rated shops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {shops.map((shop, index) => (
            <div
              key={shop.id}
              className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden hover:shadow-2xl hover:border-blue-300/70 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() => handleShopClick(shop)}
            >
              {/* 商店封面图片 */}
              <div className="relative h-36 bg-gradient-to-br from-blue-100 to-indigo-100">
                <SmartImage
                  src={shop.coverBanner || ''}
                  alt={shop.name}
                  category="shop"
                  className="w-full h-full"
                  fill
                />

                {/* 排名徽章 */}
                <div className="absolute top-2 left-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}>
                    #{index + 1}
                  </div>
                </div>

                {/* 商店头像 */}
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-white p-1">
                    <SmartImage
                      src={shop.avatar?.url || ''}
                      alt={shop.name}
                      category="shop"
                      className="w-full h-full rounded-full"
                      fill
                    />
                  </div>
                </div>
              </div>

              {/* 商店信息 */}
              <div className="p-3 pt-8 bg-gradient-to-br from-white/80 to-blue-50/50">
                <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                  {shop.name}
                </h3>

                <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                  {shop.description || 'Premium quality products and excellent service'}
                </p>

                {/* 评分 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.round(shop.ratings || 0)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">({shop.ratings?.toFixed(1) || '0.0'})</span>
                </div>

                {/* 统计信息 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="w-2.5 h-2.5 text-blue-600" />
                    </div>
                    <span className="line-clamp-1 text-gray-700">{shop.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="w-2.5 h-2.5 text-indigo-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{shop.followers?.length || 0} followers</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{shop._count?.products || 0} products</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopShops;
