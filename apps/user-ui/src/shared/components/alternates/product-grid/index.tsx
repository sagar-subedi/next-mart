'use client';

import React from 'react';
import ProductCard from '../product-card';
import { useRouter } from 'next/navigation';
import SmartImage from '../smart-image';

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode, isLoading = false }) => {
  const router = useRouter();

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-slate-600 to-gray-700"></div>
            <div className="p-4 space-y-3 bg-gradient-to-br from-slate-600/80 to-gray-700/80">
              <div className="h-4 bg-gray-500 rounded"></div>
              <div className="h-3 bg-gray-500 rounded w-3/4"></div>
              <div className="h-6 bg-gray-500 rounded w-1/2"></div>
              <div className="h-8 bg-gray-500 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-white">No products found</h3>
        <p className="mt-1 text-sm text-slate-300">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 hover:shadow-2xl hover:border-white/50 transition-all duration-300 cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="flex">
              {/* 产品图片 */}
              <div className="w-32 h-32 bg-gradient-to-br from-slate-600 to-gray-700 flex-shrink-0 rounded-l-xl overflow-hidden">
                <SmartImage
                  src={product.productImages?.[0]?.url || ''}
                  alt={product.name}
                  category={product.category}
                  className="w-full h-full"
                  fill
                />
              </div>

              {/* 产品信息 */}
              <div className="flex-1 p-4 bg-gradient-to-br from-slate-600/80 to-gray-700/80">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-sm text-gray-300 mt-1">{product.brand}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{product.description}</p>
                    
                    {/* 评分 */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            className={`w-4 h-4 ${
                              starIndex < Math.floor(product.ratings) ? 'text-yellow-400' : 'text-gray-500'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400 ml-2">({product.ratings.toFixed(1)})</span>
                    </div>

                    {/* 类别标签 */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-400/30">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 价格和操作 */}
                  <div className="text-right ml-4">
                    <div className="mb-2">
                      {product.sale_price && product.sale_price < product.regular_price ? (
                        <div>
                          <div className="text-xl font-bold text-white">
                            ${product.sale_price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400 line-through">
                            ${product.regular_price.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-white">
                          ${product.regular_price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* 库存状态 */}
                    <div className="text-sm text-gray-400 mb-2">
                      {product.stock > 0 ? (
                        <span className="text-green-400">In Stock ({product.stock})</span>
                      ) : (
                        <span className="text-red-400">Out of Stock</span>
                      )}
                    </div>

                    {/* 快速操作按钮 */}
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 网格视图
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
