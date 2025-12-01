'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, Package, ShoppingCart, Heart, MapPin, Plus, Minus, Truck } from 'lucide-react';
import { getColorNameFromHex, isLightColor, formatColorName } from '../../../../utils/colorUtils';
import { useStore } from '../../../../store';
import ProductRecommendations from '../product-recommendations';
import SmartImage from '../smart-image';

interface ProductDetailModalProps {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { addToWishlist, removeFromWishlist, wishlist, addToCart, removeFromCart, cart } = useStore();

  // 重置图片索引当产品或模态框状态改变时
  useEffect(() => {
    if (isOpen && product) {
      setSelectedImageIndex(0);
    }
  }, [isOpen, product?.id]);

  // 检查产品是否已在愿望清单中
  useEffect(() => {
    if (!product) return;

    const checkWishlistStatus = () => {
      const exists = wishlist.some(item => item.id === product.id);
      setIsInWishlist(exists);
    };

    checkWishlistStatus();
  }, [wishlist, product?.id]);

  // 检查产品是否已在购物车中
  useEffect(() => {
    if (!product) return;

    const checkCartStatus = () => {
      const exists = cart.some(item => item.id === product.id);
      setIsInCart(exists);
    };

    checkCartStatus();
  }, [cart, product?.id]);

  // 处理愿望清单操作
  const handleWishlistToggle = () => {
    if (!product) return;

    // 将 ProductCardProps 的 product 转换为 store 需要的 Product 类型
    const storeProduct = {
      id: product.id,
      title: product.name,
      name: product.name,
      price: product.sale_price || product.regular_price,
      image: product.productImages?.[0]?.url || '',
      shopId: product.seller?.shop?.id || ''
    };

    if (isInWishlist) {
      removeFromWishlist(product.id, null, null, 'web');
    } else {
      addToWishlist(storeProduct, null, null, 'web');
    }
  };

  // 处理购物车操作
  const handleCartToggle = () => {
    if (!product) return;

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
        removeFromCart(product.id, null, null, 'web');
      }
    } else {
      addToCart(storeProduct, null, null, 'web');
    }
  };

  if (!isOpen || !product) return null;

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

  const getEstimatedDelivery = (isPrime: boolean = true) => {
    const today = new Date();
    const deliveryDays = isPrime ? 2 : 3;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen pt-8 px-2 pb-4 text-center sm:block sm:pt-12 sm:pb-6">
        {/* 背景遮罩 */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* 模态框内容 */}
        <div className="inline-block align-top bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-6xl sm:w-full mx-2 h-[90vh]">
          <div className="bg-white px-3 pt-3 pb-2 sm:p-4 sm:pb-3 h-full flex flex-col">
            {/* 头部 */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0 border-b border-gray-200 pb-3">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">Product Details</h3>
              <button
                onClick={onClose}
                className="rounded-full bg-gray-100 text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* 第1列：产品图片 */}
                <div className="flex flex-col">
                  <div className="rounded-xl overflow-hidden bg-gray-50 min-h-80">
                    {product.productImages && product.productImages.length > 0 ? (
                      <SmartImage
                        src={product.productImages[selectedImageIndex]?.url || product.productImages[0].url}
                        alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                        category={product.category}
                        className="w-full h-full p-3"
                        fill
                      />
                    ) : (
                      <SmartImage
                        src=""
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full"
                        fill
                      />
                    )}
                  </div>

                  {/* 缩略图 */}
                  {product.productImages && product.productImages.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {product.productImages.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-16 h-16 rounded-md overflow-hidden bg-gray-50 cursor-pointer transition-all duration-200 flex-shrink-0 border-2 ${selectedImageIndex === index
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                          <SmartImage
                            src={image.url}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            category={product.category}
                            className="w-full h-full"
                            fill
                          />
                        </button>
                      ))}
                      {product.productImages.length > 6 && (
                        <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-transparent">
                          <span className="text-xs text-gray-500 font-medium">+{product.productImages.length - 6}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 第2列：基本信息 */}
                <div className="flex flex-col h-full overflow-y-auto">
                  <div className="space-y-3">
                    {/* 产品标题和评分 */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">{product.name}</h2>
                      {product.brand && (
                        <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.ratings.toFixed(1)})</span>
                      </div>
                    </div>

                    {/* 价格和优惠 */}
                    <div>
                      <div className="flex items-center gap-2">
                        {product.sale_price && product.sale_price < product.regular_price ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.regular_price)}
                            </span>
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              -{discountPercentage}%
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">Prime</span>
                        <span className="text-xs text-gray-600">FREE Delivery</span>
                      </div>

                      {/* 预计送达时间 */}
                      <div className="flex items-center gap-1 mt-2">
                        <Truck className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-700">
                          <span className="font-medium text-green-600">Prime delivery by</span>{' '}
                          <span className="font-semibold">{getEstimatedDelivery(true)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-3 h-3" /> {/* 占位符，保持对齐 */}
                        <span className="text-xs text-gray-600">
                          Regular delivery by {getEstimatedDelivery(false)}
                        </span>
                      </div>
                    </div>

                    {/* 库存和基本信息 */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="ml-1 font-medium">{product.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-1 font-medium">{product.subCategory}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Warranty:</span>
                          <span className="ml-1 font-medium">{product.warranty}</span>
                        </div>
                      </div>
                    </div>

                    {/* 描述 */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Description</h4>
                      <p className="text-gray-700 leading-relaxed text-xs line-clamp-3">{product.description}</p>
                    </div>

                    {/* 标签 */}
                    {product.tags && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.tags.split(',').slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 商店/卖家信息和聊天按钮 */}
                    {(product.seller?.shop || product.seller) && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.seller?.shop?.avatar ? (
                              <button
                                onClick={() => {
                                  console.log('Visit store/seller:', product.seller?.shop?.name || product.seller?.name);
                                  console.log('Seller ID:', product.seller?.id);
                                }}
                                className="hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                              >
                                <img
                                  src={product.seller.shop.avatar.url}
                                  alt={product.seller.shop.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  console.log('Visit store/seller:', product.seller?.shop?.name || product.seller?.name);
                                  console.log('Seller ID:', product.seller?.id);
                                }}
                                className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                <span className="text-white text-sm font-bold">
                                  {product.seller?.shop?.name?.charAt(0).toUpperCase() || product.seller?.name?.charAt(0).toUpperCase() || 'S'}
                                </span>
                              </button>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {product.seller?.shop?.name || product.seller?.name || 'Unknown Seller'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {product.seller?.shop ? (
                                  <>
                                    <div className="flex items-center gap-1">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < Math.floor(product.seller?.shop?.ratings || 0)
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                              }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs text-gray-600">
                                        ({(product.seller?.shop?.ratings || 0).toFixed(1)})
                                      </span>
                                    </div>
                                    <span className="text-xs text-blue-600">Official Store</span>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-600">
                                    Seller ID: {product.seller?.id?.slice(-8) || 'Unknown'}
                                  </span>
                                )}
                              </div>
                              {product.seller?.shop?.address && (
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-500" />
                                  <span className="text-xs text-gray-600 truncate">
                                    {product.seller.shop.address}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                            onClick={() => {
                              console.log('Chat with seller:', product.seller?.shop?.name || product.seller?.name);
                              console.log('Seller ID:', product.seller?.id);
                              console.log('Seller Email:', product.seller?.email);
                              // 这里可以添加聊天功能
                            }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                {/* 第3列：选项和购买 */}
                <div className="flex flex-col h-full">
                  <div className="space-y-3">
                    {/* 颜色选择 */}
                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          Color: {selectedColor && <span className="text-gray-600 font-normal">{selectedColor}</span>}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color, index) => {
                            // color 现在是十六进制值（如 #3b82f6），需要转换为颜色名称
                            const colorName = getColorNameFromHex(color);
                            const isLight = isLightColor(colorName);

                            return (
                              <button
                                key={index}
                                onClick={() => setSelectedColor(colorName)}
                                className={`flex items-center gap-2 px-2 py-1.5 border rounded transition-all duration-200 ${selectedColor === colorName
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-300 hover:border-gray-400'
                                  }`}
                                title={`Select ${colorName}`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex-shrink-0 ${isLight ? 'border border-gray-300' : 'border border-gray-200'
                                    }`}
                                  style={{ backgroundColor: color }}
                                ></div>
                                <span className="text-xs font-medium text-gray-700 capitalize">
                                  {formatColorName(colorName)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 尺寸选择 */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Size</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSize(size)}
                              className={`px-2 py-1 border rounded text-xs font-medium transition-colors duration-200 ${selectedSize === size
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                                }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 自定义规格 */}
                    {product.custom_specification && Object.keys(product.custom_specification).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Specifications</h4>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="grid grid-cols-1 gap-1 text-xs">
                            {Object.entries(product.custom_specification).slice(0, 4).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-medium">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 购买选项 */}
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              setQuantity(Math.min(product.stock, Math.max(1, value)));
                            }}
                            className="w-12 px-1 py-1 text-center text-sm border-0 focus:ring-0 focus:outline-none"
                          />
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">Max: {product.stock}</span>
                      </div>

                      <button
                        className={`w-full font-medium py-2 px-3 rounded transition-colors duration-200 text-sm ${isInCart
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                          }`}
                        onClick={handleCartToggle}
                      >
                        <ShoppingCart className="w-4 h-4 inline mr-1" />
                        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                      </button>

                      <button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded transition-colors duration-200 text-sm"
                        onClick={() => {
                          console.log('Buy now:', {
                            product: product.name,
                            quantity,
                            color: selectedColor,
                            size: selectedSize
                          });
                        }}
                      >
                        Buy Now
                      </button>

                      <button
                        className={`w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded transition-colors duration-200 text-sm ${isInWishlist ? 'bg-red-50 border-red-300 text-red-700' : ''
                          }`}
                        onClick={handleWishlistToggle}
                      >
                        <Heart className={`w-4 h-4 inline mr-1 ${isInWishlist ? 'fill-current' : ''}`} />
                        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="mt-8 mb-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
                    <p className="text-blue-800 text-xs">
                      Category: {product.category}
                    </p>
                  </div>
                </div>

                <ProductRecommendations
                  currentProductCategory={product.category}
                  currentProductId={product.id}
                  onProductClick={(recommendedProduct) => {
                    // Close current modal and open new one with recommended product
                    onClose();
                    // You can implement a callback to open the new product modal here
                    // For now, we'll just close the current one
                    console.log('Opening recommended product:', recommendedProduct);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
