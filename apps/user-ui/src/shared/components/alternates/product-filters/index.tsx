'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ProductFiltersProps {
  categories: string[];
  subCategories: Record<string, string[]>;
  onFiltersChange: (filters: FilterState) => void;
  isLoading?: boolean;
  disableOnSaleFilter?: boolean;
  externalFilters?: FilterState; // 新增：接收外部筛选状态
}

export interface FilterState {
  category: string;
  subCategory: string;
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  onSale: boolean;
  search: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  subCategories,
  onFiltersChange,
  isLoading = false,
  disableOnSaleFilter = false,
  externalFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    subCategory: '',
    priceRange: [0, 0], // 0表示无限制，显示所有产品
    minRating: 0,
    inStock: false,
    onSale: disableOnSaleFilter ? true : false, // 如果禁用促销筛选，则默认开启
    search: ''
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true
  });

  const [priceInputs, setPriceInputs] = useState({
    min: 0,
    max: 0
  });

  // 使用useRef来跟踪外部筛选器的变化，避免无限循环
  const externalFiltersRef = useRef<FilterState | undefined>(externalFilters);
  const isInternalUpdate = useRef(false);

  // 当外部筛选状态改变时，同步更新内部状态
  useEffect(() => {
    if (externalFilters && externalFilters !== externalFiltersRef.current) {
      console.log('🔍 ProductFilters: Updating internal filters from external:', externalFilters);
      externalFiltersRef.current = externalFilters;
      isInternalUpdate.current = true;
      
      setFilters(prev => ({
        ...prev,
        category: externalFilters.category || '',
        subCategory: externalFilters.subCategory || '',
        priceRange: externalFilters.priceRange || [0, 0],
        minRating: externalFilters.minRating || 0,
        inStock: externalFilters.inStock || false,
        onSale: externalFilters.onSale || (disableOnSaleFilter ? true : false),
        search: externalFilters.search || ''
      }));
      setPriceInputs({ 
        min: externalFilters.priceRange?.[0] || 0, 
        max: externalFilters.priceRange?.[1] || 0 
      });
    }
  }, [externalFilters, disableOnSaleFilter]);

  // 当筛选器改变时，通知父组件（但避免在外部更新时立即触发）
  useEffect(() => {
    // 如果是外部更新，不立即通知父组件
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // 延迟通知，避免在外部更新时立即触发
    const timer = setTimeout(() => {
      console.log('🔍 ProductFilters: Calling onFiltersChange with:', filters);
      onFiltersChange(filters);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setPriceInputs(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handlePriceBlur = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: [priceInputs.min, priceInputs.max]
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category,
      subCategory: '' // 重置子类别
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      category: '',
      subCategory: '',
      priceRange: [0, 0], // 0表示无限制，显示所有产品
      minRating: 0,
      inStock: false,
      onSale: disableOnSaleFilter ? true : false, // 如果禁用促销筛选，则默认开启
      search: ''
    };
    setFilters(defaultFilters);
    setPriceInputs({ min: 0, max: 0 });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subCategory) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] > 0) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="w-64 bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-4 animate-pulse">
        <div className="h-6 bg-gray-500 rounded mb-4"></div>
        <div className="h-4 bg-gray-500 rounded mb-2"></div>
        <div className="h-4 bg-gray-500 rounded mb-2"></div>
        <div className="h-4 bg-gray-500 rounded mb-4"></div>
        <div className="h-6 bg-gray-500 rounded mb-4"></div>
        <div className="h-4 bg-gray-500 rounded mb-2"></div>
        <div className="h-4 bg-gray-500 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gradient-to-br from-slate-700/95 via-gray-600/95 to-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-4 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 搜索框 */}
      <div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
          />
          <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 类别筛选 */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left font-medium text-white mb-3"
        >
          Categories
          <svg
            className={`w-5 h-5 transform transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ''}
                onChange={() => handleCategoryChange('')}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">All Categories</span>
            </label>
            
            {categories.map((category) => (
              <div key={category}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">{category}</span>
                </label>
                
                {/* 子类别 */}
                {filters.category === category && subCategories[category] && (
                  <div className="ml-6 mt-2 space-y-1">
                    {subCategories[category].map((subCat) => (
                      <label key={subCat} className="flex items-center">
                        <input
                          type="radio"
                          name="subCategory"
                          value={subCat}
                          checked={filters.subCategory === subCat}
                          onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">{subCat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 价格范围 */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left font-medium text-white mb-3"
        >
          Price Range
          <svg
            className={`w-5 h-5 transform transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min (0=no limit)"
                value={priceInputs.min === 0 ? '' : priceInputs.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                onBlur={handlePriceBlur}
                className="w-20 px-2 py-1 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
              <span className="text-gray-500 self-center">-</span>
              <input
                type="number"
                placeholder="Max (0=no limit)"
                value={priceInputs.max === 0 ? '' : priceInputs.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                onBlur={handlePriceBlur}
                className="w-20 px-2 py-1 text-sm border border-white/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {/* 价格滑块 */}
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1] || 1000}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], value]
                  }));
                  setPriceInputs(prev => ({ ...prev, max: value }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              {filters.priceRange[0] === 0 && filters.priceRange[1] === 0 
                ? 'No price limit' 
                : `$${filters.priceRange[0] || '0'} - $${filters.priceRange[1] || 'No limit'}`
              }
            </div>
          </div>
        )}
      </div>

      {/* 评分筛选 */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left font-medium text-white mb-3"
        >
          Rating
          <svg
            className={`w-5 h-5 transform transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.minRating === rating}
                  onChange={() => handleFilterChange('minRating', rating)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-700 ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 可用性筛选 */}
      <div>
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-left font-medium text-white mb-3"
        >
          Availability
          <svg
            className={`w-5 h-5 transform transition-transform ${expandedSections.availability ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                className="mr-2 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
            
            <label className={`flex items-center ${disableOnSaleFilter ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                disabled={disableOnSaleFilter}
                className="mr-2 text-blue-600 focus:ring-blue-500 rounded disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">
                On Sale
                {disableOnSaleFilter && <span className="text-xs text-gray-500 ml-1">(Always enabled)</span>}
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
