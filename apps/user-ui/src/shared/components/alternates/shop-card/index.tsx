'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Users, TrendingUp } from 'lucide-react';
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

interface ShopCardProps {
    shop: Shop;
    index?: number;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, index = 0 }) => {
    const router = useRouter();

    const handleShopClick = () => {
        router.push(`/shops/${shop.id}`);
    };

    return (
        <div
            className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 overflow-hidden hover:shadow-2xl hover:border-blue-300/70 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
            onClick={handleShopClick}
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
    );
};

export default ShopCard;
