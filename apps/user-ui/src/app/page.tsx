'use client';

import React from 'react';
import Hero from '../shared/components/Hero';
import SectionTitle from '../shared/widgets/section/SectionTitle';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../shared/components/cards/ProductCard';
import ShopCard from '../shared/components/cards/ShopCard';
import TechnologyStack from '../shared/components/TechnologyStack';
import EmptyState from '../shared/components/EmptyState';
import { ShoppingBag, Store, Tag } from 'lucide-react';

const Page = () => {
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/recommendation/api/get-recommendation-products'
      );
      return response?.data?.recommendations || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: latestProducts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/products/api/get-all-products?page=1&limit=10&type=latest'
      );
      return response?.data || { products: [] };
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: shops, isLoading: isShopLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/api/top-shops');
      return response?.data?.shops || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: events, isLoading: isEventLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        '/products/api/get-all-events?page=1&limit=10'
      );
      return response?.data?.events || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <TechnologyStack />
      <div className="md:w-[80%] w-[90%] m-auto my-10">
        {/* Suggested products */}
        <div className="mb-8">
          <SectionTitle title="Suggested Products" />
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {!products || products.length === 0 ? (
              <EmptyState
                title="No suggestions yet"
                message="We're still learning your preferences. Check back soon!"
              />
            ) : (
              products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}

        {/* Latest products */}
        <div className="my-8 block">
          <SectionTitle title="Latest Products" />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[380px] bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {!latestProducts?.products || latestProducts.products.length === 0 ? (
              <EmptyState
                title="No new arrivals"
                message="Check back later for the latest products."
                icon={ShoppingBag}
              />
            ) : (
              latestProducts.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}

        {/* Top shops */}
        <div className="my-8 block">
          <SectionTitle title="Top Shops" />
        </div>
        {!isShopLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {!shops || shops.length === 0 ? (
              <EmptyState
                title="No shops found"
                message="We couldn't find any top shops at the moment."
                icon={Store}
              />
            ) : (
              shops.map((shop: any) => <ShopCard key={shop.id} shop={shop} />)
            )}
          </div>
        )}

        {/* Top offers */}
        <div className="my-8 block">
          <SectionTitle title="Top Offers" />
        </div>
        {!isEventLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {!events || events.length === 0 ? (
              <EmptyState
                title="No active offers"
                message="There are no special offers running right now."
                icon={Tag}
              />
            ) : (
              events.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isEvent={true}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
