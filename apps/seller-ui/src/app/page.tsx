'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sendKafkaEvent } from 'apps/user-ui/src/actions/track-user';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiTimeLine,
  RiGlobalLine,
  RiHeartLine,
  RiHeartFill,
  RiMapPin2Line,
  RiPencilLine,
  RiShoppingBag3Line,
  RiSparklingLine,
  RiStarFill,
  RiGroupLine,
  RiTwitterXFill,
  RiYoutubeFill,
} from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '../shared/components/ProductCard';
import useSeller from '../hooks/useSeller';
import { useRouter } from 'next/navigation';

const TABS = ['Products', 'Offers', 'Reviews'];

const fetchProducts = async () => {
  const res = await axiosInstance.get('/products/api/get-shop-products');
  const products = res.data.products?.filter((i: any) => !i.startingDate);
  return products;
};

const fetchEvents = async () => {
  const res = await axiosInstance.get('/products/api/get-shop-events');
  const events = res.data.products?.filter((i: any) => i.startingDate);
  return events;
};

const Page = () => {
  const router = useRouter();
  const { seller } = useSeller();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Products');
  const [editType, setEditType] = useState<'cover' | 'avatar' | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!seller && !isLoading) router.push('/login');
  }, [seller, isLoading]);

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['shop-events'],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      {isLoading ? (
        <div></div>
      ) : (
        <div className="w-full bg-slate-50 min-h-screen pb-20">
          {/* Back to dashboard button */}
          <div className="w-full px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                className="text-slate-500 hover:text-brand-primary-600 flex items-center gap-2 font-bold text-sm transition-colors group"
                onClick={() => router.push('/dashboard')}
              >
                <RiArrowLeftLine className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shop Preview Mode</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="relative w-full h-[350px] overflow-hidden group">
            {/* Cover banner */}
            <Image
              src={seller.shop?.coverBanner || 'https://placehold.co/1200x400/f1f5f9/334155.png?text=Shop+Cover'}
              alt="Seller cover"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/90 via-slate-50/20 to-transparent" />

            {seller.id && (
              <button
                className="absolute bottom-6 right-6 bg-white/50 backdrop-blur-md hover:bg-white/80 text-slate-900 px-4 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-2 text-sm font-bold shadow-lg"
                onClick={() => setEditType('cover')}
              >
                <RiPencilLine size={18} /> Edit Cover
              </button>
            )}
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="mt-[-80px] z-20 relative flex flex-col lg:flex-row gap-8">
              {/* Main Info Card */}
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary-500 via-brand-highlight-500 to-brand-primary-500" />

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                  <div className="relative group shrink-0">
                    <div className="size-32 rounded-3xl border-4 border-white overflow-hidden shadow-2xl relative bg-slate-100">
                      <Image
                        src={seller.shop?.avatar?.fileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.shop?.name || 'Shop')}&background=random`}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {seller.id && (
                      <button
                        className="absolute -bottom-2 -right-2 bg-brand-primary-600 hover:bg-brand-primary-500 p-2.5 rounded-2xl shadow-lg shadow-brand-primary-500/30 transition-all border-2 border-white text-white"
                        onClick={() => setEditType('avatar')}
                      >
                        <RiPencilLine size={18} />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                          {seller.shop?.name}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-500">
                          <RiMapPin2Line size={16} className="text-brand-primary-500" />
                          {seller.shop?.address || 'Location not set'}
                        </div>
                      </div>

                      {seller.id ? (
                        <button
                          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-2 w-fit mx-auto md:mx-0 border border-slate-200"
                          onClick={() => router.push('/dashboard/settings')}
                        >
                          <RiPencilLine size={18} /> Edit Profile
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsFollowing(!isFollowing)}
                          className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all w-fit mx-auto md:mx-0 ${isFollowing
                            ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                            : 'bg-brand-primary-600 text-white hover:bg-brand-primary-500 shadow-lg shadow-brand-primary-500/25'
                            }`}
                        >
                          {isFollowing ? <RiHeartFill size={18} /> : <RiHeartLine size={18} />}
                          {isFollowing ? 'Following' : 'Follow Shop'}
                        </button>
                      )}
                    </div>

                    <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-3xl">
                      {seller.shop?.bio || 'Welcome to our shop! We provide high quality products and excellent customer service.'}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm mb-1">
                          <RiStarFill size={18} className="text-amber-500" />
                          <span>Rating</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{seller.shop?.ratings || '0.0'}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm mb-1">
                          <RiGroupLine size={18} />
                          <span>Followers</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{seller.followers}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
                          <RiTimeLine size={18} />
                          <span>Open</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 truncate w-full text-center md:text-left">
                          {seller.shop?.openingHours || '9am - 6pm'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-1.5 text-purple-600 font-bold text-sm mb-1">
                          <RiShoppingBag3Line size={18} />
                          <span>Products</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{products?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Details */}
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full lg:w-[320px] flex flex-col gap-6 h-fit sticky top-24">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    Shop Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <RiCalendarLine size={20} className="text-slate-400" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Joined</span>
                        <span className="text-sm font-bold text-slate-900">
                          {new Date(seller.shop?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {seller.shop?.website && (
                      <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <RiGlobalLine size={20} className="text-slate-400" />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Website</span>
                          <Link
                            href={seller.shop.website}
                            className="text-sm font-bold text-brand-primary-600 hover:underline truncate max-w-[200px]"
                          >
                            {seller.shop.website.replace(/^https?:\/\//, '')}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {seller.shop?.socialLinks && seller.shop.socialLinks.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                      Connect With Us
                    </h3>
                    <div className="flex gap-3">
                      {seller.shop.socialLinks.map((link: any, index: number) => (
                        <Link
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary-50 hover:text-brand-primary-600 transition-all border border-slate-200 hover:border-brand-primary-200 shadow-sm"
                        >
                          {link.type === 'youtube' && <RiYoutubeFill size={20} />}
                          {link.type === 'x' && <RiTwitterXFill size={18} />}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-12">
              <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab
                      ? 'text-brand-primary-600'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-600" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {activeTab === 'Products' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {isLoading ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="bg-slate-100 h-[350px] animate-pulse rounded-2xl border border-slate-200"
                        />
                      ))
                    ) : products.length > 0 ? (
                      products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                          <RiShoppingBag3Line className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No products yet</h3>
                        <p className="text-slate-500">This shop hasn&apos;t added any products yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Offers' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {isEventsLoading ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="bg-slate-100 h-[350px] animate-pulse rounded-2xl border border-slate-200"
                        />
                      ))
                    ) : events?.length > 0 ? (
                      events.map((product: any) => (
                        <ProductCard key={product.id} product={product} isEvent />
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                          <RiSparklingLine className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No active offers</h3>
                        <p className="text-slate-500">Check back later for exciting deals and events!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Reviews' && (
                  <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                      <RiStarFill className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
                    <p className="text-slate-500">Be the first to share your experience with this shop!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
