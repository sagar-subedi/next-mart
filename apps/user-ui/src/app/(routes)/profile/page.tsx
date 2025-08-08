'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import useRequireAuth from 'apps/user-ui/src/hooks/useRequireAuth';
import QuickActionCard from 'apps/user-ui/src/shared/components/cards/QuickActionCard';
import StatCard from 'apps/user-ui/src/shared/components/cards/StatCard';
import ChangePasswordSection from 'apps/user-ui/src/shared/widgets/section/ChangePasswordSection';
import NavItem from 'apps/user-ui/src/shared/widgets/section/NavItem';
import OrdersSection from 'apps/user-ui/src/shared/widgets/section/OrdersSection';
import ShippingAddressSection from 'apps/user-ui/src/shared/widgets/section/ShippingAddressSection';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import {
  BadgeCheck,
  Bell,
  CheckCircle,
  Clock,
  Gift,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  PhoneCall,
  Receipt,
  Settings,
  ShoppingBag,
  Truck,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface User {
  name: string;
  points?: number;
  email: string;
  avatar: string;
  createdAt: string;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoading } = useRequireAuth() as {
    user: User | null;
    isLoading: boolean;
  };
  const queryTab = searchParams.get('active') || 'Profile';
  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => {
    if (activeTab !== queryTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('active', activeTab);
      router.replace(`/profile?${newParams.toString().toLowerCase()}`);
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await axiosInstance.get(`/logout-user`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      router.push('/login');
    });
  };

  const fetchOrders = async () => {
    const res = await axiosInstance.get('/orders/get-user-orders');
    return res.data.orders;
  };

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });

  const totalOrders = orders.length;
  const processingOrders = orders.filter(
    (o: any) =>
      o.deliveryStatus !== 'Delivered' && o.deliveryStatus !== 'Cancelled'
  ).length;
  const completedOrders = orders.filter(
    (o: any) => o.deliveryStatus === 'Delivered'
  ).length;

  const { data: notifications, isLoading: areNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/admin/get-user-notifications');
      return res.data.notifications;
    },
  });

  const markAsRead = async (notificationId: string) => {
    await axiosInstance.put(`/seller/mark-as-read`, {
      notificationId,
    });
  };

  return (
    <div className="bg-gray-50 p-6 pb-14">
      <div className="md:max-w-7xl mx-auto">
        {/* Greeting */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{' '}
            <span className="text-blue-600">
              {isLoading ? (
                <Loader2 className="inline animate-spin size-5" />
              ) : (
                `${user?.name || 'User'}`
              )}
              /
            </span>
            👋
          </h1>
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard title="Total Orders" count={totalOrders} Icon={Clock} />
          <StatCard
            title="Processing Orders"
            count={processingOrders}
            Icon={Truck}
          />
          <StatCard
            title="Completed Orders"
            count={completedOrders}
            Icon={CheckCircle}
          />
        </div>
        {/* Sidebar */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {/* Left navigation */}
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 w-full md:w-1/5">
            <nav className="space-y-2">
              <NavItem
                label="Profile"
                Icon={User}
                isActive={activeTab === 'Profile'}
                onClick={() => setActiveTab('Profile')}
              />
              <NavItem
                label="My Orders"
                Icon={ShoppingBag}
                isActive={activeTab === 'My Orders'}
                onClick={() => setActiveTab('My Orders')}
              />
              <NavItem
                label="Inbox"
                Icon={Inbox}
                isActive={activeTab === 'Inbox'}
                onClick={() => router.push('/inbox')}
              />
              <NavItem
                label="Notifications"
                Icon={Bell}
                isActive={activeTab === 'Notifications'}
                onClick={() => setActiveTab('Notifications')}
              />
              <NavItem
                label="Shipping Address"
                Icon={MapPin}
                isActive={activeTab === 'Shipping Address'}
                onClick={() => setActiveTab('Shipping Address')}
              />
              <NavItem
                label="Change Password"
                Icon={Lock}
                isActive={activeTab === 'Change Password'}
                onClick={() => setActiveTab('Change Password')}
              />
              <NavItem
                label="Logout"
                Icon={LogOut}
                isDanger
                onClick={handleLogout}
              />
            </nav>
          </div>
          {/* Main content */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 w-full md:w-1/2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {activeTab}
            </h2>
            {activeTab === 'Profile' && !isLoading && user ? (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.avatar || '/images/profile.png'}
                    alt="avatar"
                    width={60}
                    height={60}
                    className="size-16 rounded-full border border-gray-200"
                  />
                  <button className="flex items-center gap-1 text-xs font-medium text-blue-500">
                    <Pencil className="size-4" />
                    Change Photo
                  </button>
                </div>
                <p>
                  <span className="font-semibold">Joined:</span>{' '}
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Earned Points:</span>{' '}
                  {user?.points || 0}
                </p>
              </div>
            ) : (
              <p className="text-center">User Information not available yet!</p>
            )}
            {activeTab === 'Shipping Address' && <ShippingAddressSection />}
            {activeTab === 'My Orders' && (
              <OrdersSection isLoading={isOrdersLoading} orders={orders} />
            )}
            {activeTab === 'Change Password' && <ChangePasswordSection />}
            {activeTab === 'Notifications' && (
              <div className="space-y-4 text-sm text-gray-700">
                <p>Notifications</p>

                {areNotificationsLoading ? (
                  <p>Loading...</p>
                ) : notifications.length === 0 ? (
                  <p>No notifications available yet</p>
                ) : (
                  <div className="md:w-[80%] my-6 rounded-lg divide-y divide-gray-800 bg-black/40 shadow-sm backdrop-blur-sm">
                    {notifications.map((notification: any) => (
                      <Link
                        href={notification.redirectLink}
                        key={notification.id}
                        className={`block px-5 py-4 transition ${
                          notification.status !== 'Unread'
                            ? 'hover:bg-gray-800/40'
                            : 'bg-gray-800/50 hover:bg-gray-800/70'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {notification.title}
                            </span>
                            <span className="text-gray-300 text-sm">
                              {notification.message}
                            </span>
                            <span className="text-gray-500 text-xs mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString('en-UK', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Right quick panel */}
          <div className="w-full md:w-1/4 space-y-4">
            <QuickActionCard
              Icon={Gift}
              title="Referral Program"
              description="Invite friends and earn rewards"
            />
            <QuickActionCard
              Icon={BadgeCheck}
              title="Your Badges"
              description="View your earned achievements"
            />
            <QuickActionCard
              Icon={Settings}
              title="Account settings"
              description="Manage preferences and security"
            />
            <QuickActionCard
              Icon={Receipt}
              title="Billing History"
              description="Check your recent payments"
            />
            <QuickActionCard
              Icon={PhoneCall}
              title="Support Center"
              description="Need Help? Contact Support."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
