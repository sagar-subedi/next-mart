'use client';

import React from 'react';
import Link from 'next/link';
import {
  RiAddLine,
  RiStore2Line,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiBox3Line,
  RiGroupLine,
  RiArrowRightLine,
  RiStarFill,
  RiMapPinLine,
  RiTimeLine,
  RiGlobalLine,
  RiMoreFill,
} from 'react-icons/ri';
import useSeller from 'apps/seller-ui/src/hooks/useSeller';

const Dashboard = () => {
  const { seller } = useSeller();

  // Mock Data for Stats
  const stats = [
    {
      title: 'Total Sales',
      value: '$1,250.50',
      change: '-43.7%',
      isPositive: false,
      icon: RiMoneyDollarCircleLine,
      color: 'blue',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20',
    },
    {
      title: 'Total Orders',
      value: '23',
      change: '-46.7%',
      isPositive: false,
      icon: RiShoppingCartLine,
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Total Products',
      value: '0',
      subtext: 'Active listings',
      icon: RiBox3Line,
      color: 'purple',
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total Customers',
      value: '18',
      subtext: 'Unique buyers',
      icon: RiGroupLine,
      color: 'orange',
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      border: 'border-orange-500/20',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            Welcome back, {seller?.name?.split(' ')[0] || 'Seller'}! <span className="animate-wave">👋</span>
          </h1>
          <p className="text-slate-500">
            Here's what's happening with your store today
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/dashboard/create-product"
            className="flex items-center gap-2 bg-brand-primary-600 hover:bg-brand-primary-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-primary-500/20"
          >
            <RiAddLine size={20} />
            Add Product
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition-all border border-slate-200 shadow-sm"
          >
            <RiStore2Line size={20} />
            Manage Shops
          </Link>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-2xl border ${stat.border} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 shadow-sm`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-sm font-medium ${stat.text}`}>
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.text}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </span>
              {stat.change && (
                <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                  <span className="inline-block rotate-45">↓</span>
                  {stat.change} from last month
                </span>
              )}
              {stat.subtext && (
                <span className="text-xs font-medium text-slate-500">
                  {stat.subtext}
                </span>
              )}
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Shops Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary-500/10 rounded-lg text-brand-primary-500">
                <RiStore2Line size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">My Shops</h2>
            </div>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-brand-primary-600 hover:text-brand-primary-500 transition-colors"
            >
              Manage Shops
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shop Card - Dynamic */}
            {seller?.shop ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {seller.shop.name}
                    </h3>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                      {seller.shop.description || 'General Store'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                    <RiStarFill size={14} />
                    <span className="text-xs font-bold">0.0</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RiMapPinLine size={16} className="text-slate-400" />
                    <span className="truncate">{seller.shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RiTimeLine size={16} className="text-slate-400" />
                    <span>Mon - Fri</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RiGlobalLine size={16} className="text-slate-400" />
                    <span className="truncate text-brand-primary-600">
                      https://dokomart.sagar88.com.np/shops/{seller.shop.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Followers</span>
                      <span className="text-sm font-bold text-slate-900">0</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">Products</span>
                      <span className="text-sm font-bold text-slate-900">0</span>
                    </div>
                  </div>
                  <Link
                    href={`/shops/${seller.shop.id}`}
                    className="text-sm font-medium text-brand-primary-600 hover:text-brand-primary-500 flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    View Details
                    <RiArrowRightLine size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                <RiStore2Line size={48} className="mb-4 opacity-20" />
                <p>No shops found. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">Pending</span>
                </div>
                <span className="text-slate-900 font-bold">3</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Completed</span>
                </div>
                <span className="text-slate-900 font-bold">20</span>
              </div>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Comparison</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">This Month</span>
                <span className="text-slate-900 font-bold">$450.25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Month</span>
                <span className="text-slate-900 font-bold">$800.25</span>
              </div>
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Change</span>
                <span className="text-red-500 font-bold">-43.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
