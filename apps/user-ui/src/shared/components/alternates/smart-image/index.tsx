'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  category?: string;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
  onError?: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  category,
  fallbackSrc,
  className = '',
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  onClick,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 默认图片映射
  const getDefaultImage = (cat?: string): string => {
    const defaultImages: Record<string, string> = {
      'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
      'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      'home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
      'automotive': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'toys': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop',
      'food': 'https://images.unsplash.com/photo-1504674900240-9c9c3b8c6e8b?w=800&h=600&fit=crop',
      'health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'jewelry': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop',
      'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
      'pet': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop',
      'baby': 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=600&fit=crop',
      'office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'art': 'https://images.unsplash.com/photo-1541961017774-22349e4a1267?w=800&h=600&fit=crop',
      'outdoor': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      'shop': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
    };

    return defaultImages[cat?.toLowerCase() || ''] || defaultImages['electronics'];
  };

  // 验证图片URL
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // 检查是否需要unoptimized（外部图片服务）
  const needsUnoptimized = (url: string): boolean => {
    return url.includes('images.unsplash.com') || 
           url.includes('pixabay.com') || 
           url.includes('picsum.photos') ||
           url.includes('ik.imagekit.io');
  };

  // 获取最终的图片URL
  const getFinalImageUrl = (): string => {
    // 优先级：src > fallbackSrc > 默认图片
    if (src && isValidImageUrl(src)) {
      return src;
    }
    if (fallbackSrc && isValidImageUrl(fallbackSrc)) {
      return fallbackSrc;
    }
    return getDefaultImage(category);
  };

  // 处理图片加载错误
  const handleImageError = () => {
    console.log(`Image failed to load: ${imageSrc}, trying fallback...`);
    setHasError(true);
    setIsLoading(false);
    
    // 尝试使用fallback或默认图片
    const fallbackUrl = fallbackSrc || getDefaultImage(category);
    if (fallbackUrl !== imageSrc) {
      setImageSrc(fallbackUrl);
      setHasError(false);
      setIsLoading(true);
    }
    
    onError?.();
  };

  // 处理图片加载成功
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // 初始化图片源
  useEffect(() => {
    const finalUrl = getFinalImageUrl();
    setImageSrc(finalUrl);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc, category]);

  // 如果没有有效的图片源，显示占位符
  if (!imageSrc || !isValidImageUrl(imageSrc)) {
    return (
      <div 
        className={`relative bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes={sizes}
          onError={handleImageError}
          onLoad={handleImageLoad}
          unoptimized={needsUnoptimized(imageSrc)}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className="object-cover"
          priority={priority}
          onError={handleImageError}
          onLoad={handleImageLoad}
          unoptimized={needsUnoptimized(imageSrc)}
        />
      )}
      
      {/* 加载状态指示器 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 错误状态指示器 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-xs text-gray-500">Image not available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
