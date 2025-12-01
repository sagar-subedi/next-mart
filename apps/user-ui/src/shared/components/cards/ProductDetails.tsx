'use client';

import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageSquareText,
  Package,
  ShoppingCart,
  WalletMinimal,
  Star,
  Minus,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Ratings from '../Ratings';
import Link from 'next/link';
import ReactImageMagnify from 'react-image-magnify';
import { useStore } from 'apps/user-ui/src/store';
import ProductCard from './ProductCard';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { isProtected } from 'apps/user-ui/src/utils/protected';
import { useRouter } from 'next/navigation';

interface Props {
  product: any;
}

const ProductDetails = ({ product }: Props) => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const addToCart = useStore((state) => state.addToCart);
  const cart = useStore((state) => state.cart);
  const isInCart = cart.some((item) => item.id === product.id);
  const wishlist = useStore((state) => state.wishlist);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const { location } = useLocationTracking();
  const { deviceInfo } = useDeviceTracking();
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [priceRange, setPriceRange] = useState([product.salePrice, 1199]);
  const [currentImage, setCurrentImage] = useState(product.images[0]?.fileUrl);

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentImage(product.images[currentIndex - 1]);
    }
  };

  const nextImage = () => {
    if (currentIndex < product.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentImage(product.images[currentIndex + 1]);
    }
  };

  const discountPercentage = Math.round(
    ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
  );

  const fetchFilteredProducts = async () => {
    try {
      const query = new URLSearchParams();

      query.set('priceRange', priceRange.join(','));
      query.set('page', '1');
      query.set('limit', '5');

      const response = await axiosInstance.get(
        `/products/api/get-filtered-products?query=${query.toString()}`
      );

      setRecommendedProducts(response.data?.products);
    } catch (error) {
      console.error(`Failed to get recommended products: ${error}`);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [priceRange]);

  const handleChat = async () => {
    if (isChatLoading) return;

    setIsChatLoading(true);

    try {
      const res = await axiosInstance.post(
        '/chats/api/create-user-conversation-group',
        { sellerId: product.shop.sellerId },
        isProtected
      );

      router.push(`/inbox?conversationId=${res.data.conversation.id}`);
    } catch (error) {
      console.log(`Error creating conversation group: ${error}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#f5f5f5] py-8">
      {/* Breadcrumb */}
      <div className="w-[90%] lg:w-[80%] mx-auto mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/products" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="w-[90%] lg:w-[80%] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-visible bg-gray-50 border border-gray-200">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: 'Product image',
                      isFluidWidth: true,
                      src: currentImage,
                    },
                    largeImage: {
                      src: currentImage,
                      width: 1200,
                      height: 1800,
                    },
                    enlargedImageContainerDimensions: {
                      width: '150%',
                      height: '100%',
                    },
                    enlargedImageContainerClassName: 'z-50',
                    enlargedImageContainerStyle: {
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    },
                    isHintEnabled: true,
                    shouldHideHintAfterFirstActivation: false,
                    enlargedImagePosition: 'beside',
                    lensStyle: {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '2px solid rgb(59, 130, 246)',
                      cursor: 'crosshair',
                    },
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="relative flex items-center gap-2">
                {product.images.length > 4 && (
                  <button
                    className="absolute left-0 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
                    onClick={prevImage}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image: any, index: number) => (
                    <Image
                      src={image.fileUrl}
                      key={index}
                      alt="Thumbnail"
                      width={80}
                      height={80}
                      className={`cursor-pointer border-2 rounded-lg transition-all ${currentImage === image.fileUrl
                        ? 'border-brand-primary-500 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        setCurrentIndex(index);
                        setCurrentImage(image.fileUrl);
                      }}
                    />
                  ))}
                </div>
                {product.images.length > 4 && (
                  <button
                    className="absolute right-0 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
                    onClick={nextImage}
                    disabled={currentIndex === product.images.length - 1}
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                <button
                  onClick={() =>
                    isInWishlist
                      ? removeFromWishlist(product.id, user, location, deviceInfo)
                      : addToWishlist(
                        {
                          ...product,
                          quantity,
                          selectedOptions: {
                            color: selectedColor,
                            size: selectedSize,
                          },
                        },
                        user,
                        location,
                        deviceInfo
                      )
                  }
                  className="flex-shrink-0 p-3 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Heart
                    size={28}
                    fill={isInWishlist ? '#ef4444' : 'transparent'}
                    color={isInWishlist ? '#ef4444' : '#9ca3af'}
                    className="transition-colors"
                  />
                </button>
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1 text-yellow-400">
                  <Ratings rating={product.rating} />
                </div>
                <Link href="#reviews" className="text-brand-primary-600 hover:underline text-sm">
                  (0 reviews)
                </Link>
              </div>

              {/* Brand */}
              <div className="flex items-center gap-2 pb-4 border-b">
                <span className="text-gray-600">Brand:</span>
                <span className="font-semibold text-brand-primary-600">
                  {product?.brand || 'No brand'}
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-brand-primary-600">
                    ${product?.salePrice}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                </div>
                {product.regularPrice > product.salePrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-400 line-through">
                      ${product.regularPrice}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      You save ${(product.regularPrice - product.salePrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Color and Size Options */}
              <div className="space-y-4 pt-4">
                {product?.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((color: string, index: number) => (
                        <button
                          key={index}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                            ? 'border-brand-primary-500 scale-110 shadow-lg ring-2 ring-brand-primary-200'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                          onClick={() => setSelectedColor(color)}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product?.sizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size: string, index: number) => (
                        <button
                          key={index}
                          className={`px-5 py-2 rounded-lg border-2 font-medium transition-all ${selectedSize === size
                            ? 'bg-brand-primary-500 text-white border-brand-primary-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-brand-primary-300'
                            }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Stock */}
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability
                  </label>
                  {product?.stock > 0 ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">
                        In Stock ({product?.stock} available)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 hover:from-brand-primary-600 hover:to-brand-primary-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all ${isInCart || product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isInCart || product.stock === 0}
                onClick={() =>
                  addToCart(
                    {
                      ...product,
                      quantity,
                      selectedOptions: {
                        color: selectedColor,
                        size: selectedSize,
                      },
                    },
                    user,
                    location,
                    deviceInfo
                  )
                }
              >
                <ShoppingCart size={24} />
                {isInCart ? 'Already in Cart' : 'Add to Cart'}
              </button>

              {/* Delivery and Return Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">
                      {`${location?.city}, ${location?.country}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-brand-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Return Policy</p>
                    <p className="text-sm text-gray-600">7 Days return</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <WalletMinimal className="w-5 h-5 text-brand-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Warranty</p>
                    <p className="text-sm text-gray-600">Not available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Info Section */}
          <div className="border-t bg-gray-50 p-6 lg:p-8">
            <div className="max-w-4xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="text-xl font-bold text-gray-900">{product.shop?.name}</p>
                  </div>
                  <button
                    onClick={() => handleChat()}
                    disabled={isChatLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-medium rounded-lg transition-colors"
                  >
                    <MessageSquareText size={18} />
                    {isChatLoading ? 'Loading...' : 'Chat Now'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-primary-600">88%</p>
                    <p className="text-sm text-gray-600">Seller Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-primary-600">100%</p>
                    <p className="text-sm text-gray-600">Ship on Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-primary-600">100%</p>
                    <p className="text-sm text-gray-600">Chat Response</p>
                  </div>
                </div>

                <div className="text-center pt-4 border-t mt-4">
                  <Link
                    className="text-brand-primary-600 font-semibold hover:underline"
                    href={`/shop/${product.shop?.id}`}
                  >
                    Visit Store →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="w-[90%] lg:w-[80%] mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h3>
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="w-[90%] lg:w-[80%] mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ratings & Reviews
          </h3>
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews available yet!</p>
            <p className="text-gray-400 text-sm mt-2">Be the first to review this product</p>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="w-[90%] lg:w-[80%] mx-auto mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recommendedProducts?.map((item: any) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
