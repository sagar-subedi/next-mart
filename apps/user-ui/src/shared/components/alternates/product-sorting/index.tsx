'use client';

import React from 'react';

interface ProductSortingProps {
  totalProducts: number;
  sortBy: string;
  sortOrder: string;
  viewMode: 'grid' | 'list';
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ProductSorting: React.FC<ProductSortingProps> = ({
  totalProducts,
  sortBy,
  sortOrder,
  viewMode,
  onSortChange,
  onViewModeChange
}) => {
  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price' },
    { value: 'ratings', label: 'Rating' }
  ];

  const handleSortChange = (newSortBy: string) => {
    let newSortOrder = 'desc';
    
    // 如果选择的是相同的排序字段，则切换排序顺序
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    // 对于价格和名称，默认使用升序
    if (newSortBy === 'price' || newSortBy === 'name') {
      newSortOrder = 'asc';
    }
    
    onSortChange(newSortBy, newSortOrder);
  };

  const getSortIcon = (optionValue: string) => {
    if (sortBy !== optionValue) return null;
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 产品数量 */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{totalProducts}</span> products
        </div>

        <div className="flex items-center gap-4">
          {/* 排序选项 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 flex items-center ${
                    sortBy === option.value
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {getSortIcon(option.value)}
                </button>
              ))}
            </div>
          </div>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSorting;
