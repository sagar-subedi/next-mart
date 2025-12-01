'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../../../../store';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
  showTotal?: boolean;
}

const CartIcon: React.FC<CartIconProps> = ({
  className = '',
  showCount = true,
  showTotal = false
}) => {
  const { cart } = useStore();

  // 计算购物车中的商品总数
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // 计算购物车总价
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className={`relative ${className}`}>
      <ShoppingCart className="w-6 h-6 text-gray-600" />

      {/* 商品数量徽章 */}
      {showCount && totalItems > 0 && (
        <div className="absolute -top-3 -right-3 w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </div>
      )}

      {/* 总价显示 */}
      {showTotal && totalPrice > 0 && (
        <div className="absolute -bottom-8 -right-2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-lg whitespace-nowrap">
          <span className="text-xs font-medium text-gray-700">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
