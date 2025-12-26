'use client';

import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Props {
  shop: {
    id: string;
    name: string;
    description?: string;
    avatar: any; // Changed from string to any to handle relation object
    coverBanner?: string;
    address?: string;
    followers?: any[];
    rating?: number;
    category?: string;
  };
}

const ShopCard = ({ shop }: Props) => {
  const [coverSrc, setCoverSrc] = useState(
    shop?.coverBanner || 'https://placehold.co/1200x400/1e293b/cbd5e1.png?text=Shop+Cover'
  );
  const [avatarSrc, setAvatarSrc] = useState(
    shop?.avatar?.[0]?.fileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop?.name || 'Shop')}&background=random`
  );

  // Update state if props change
  useEffect(() => {
    setCoverSrc(shop?.coverBanner || 'https://placehold.co/1200x400/1e293b/cbd5e1.png?text=Shop+Cover');
    setAvatarSrc(shop?.avatar?.[0]?.fileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop?.name || 'Shop')}&background=random`);
  }, [shop]);

  return (
    <div className="w-full rounded-xl cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 group flex flex-col h-full">
      {/* Cover */}
      <div className="h-[120px] w-full relative bg-gray-100">
        <Image
          src={coverSrc}
          alt="cover"
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={() => setCoverSrc('https://placehold.co/1200x400/1e293b/cbd5e1.png?text=Shop+Cover')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Shop avatar */}
      <div className="relative flex justify-center -mt-10 z-10">
        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
          <Image
            src={avatarSrc}
            alt={shop.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            onError={() => setAvatarSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(shop?.name || 'Shop')}&background=random`)}
          />
        </div>
      </div>

      {/* Shop information */}
      <div className="px-4 pb-5 pt-2 text-center flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{shop.name}</h3>
        <p className="text-sm text-gray-500 mb-3">
          {shop.followers?.length ?? 0} Followers
        </p>

        {/* Address & rating */}
        <div className="flex items-center justify-center text-xs text-gray-600 mt-auto gap-3 flex-wrap mb-3">
          {shop.address ? (
            <span className="flex items-center gap-1 max-w-[140px] bg-gray-50 px-2 py-1 rounded-md">
              <MapPin className="size-3 shrink-0 text-brand-primary-500" />
              <span className="truncate">{shop.address}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <MapPin className="size-3 shrink-0 text-gray-400" />
              <span className="text-gray-400 italic">No address</span>
            </span>
          )}
          <span className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-yellow-700 font-medium">
            <Star className="size-3 text-yellow-500 fill-yellow-500" />
            {shop.rating ?? 'New'}
          </span>
        </div>

        {/* Shop category */}
        {shop.category && (
          <div className="mb-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-brand-primary-50 capitalize text-brand-primary-600 px-3 py-1 rounded-full font-medium border border-brand-primary-100">
              {shop.category}
            </span>
          </div>
        )}

        {/* Visit button */}
        <div className="mt-2">
          <Link
            href={`/shops/${shop.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-brand-primary-500 text-brand-primary-600 text-sm font-semibold rounded-lg hover:bg-brand-primary-50 transition-colors group-hover:bg-brand-primary-500 group-hover:text-white"
          >
            Visit Shop
            <ArrowUpRight className="size-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
