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
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export interface User {
  name: string;
  points?: number;
  email: string;
  avatar?: {
    fileUrl: string;
    fileId: string;
  };
  createdAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isLoading } = useRequireAuth() as {
    user: User | null;
    isLoading: boolean;
  };
  const queryTab = searchParams.get('active') || 'Profile';
  const [activeTab, setActiveTab] = useState(queryTab);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (activeTab !== queryTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('active', activeTab);
      router.replace(`/profile?${newParams.toString().toLowerCase()}`);
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await axiosInstance.get(`/api/logout-user`).then((res) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      router.push('/login');
    });
  };

  const fetchOrders = async () => {
    const res = await axiosInstance.get('/orders/api/get-user-orders');
    return res.data.orders;
  };

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });

  const totalOrders = orders?.length;
  const processingOrders = orders?.filter(
    (o: any) =>
      o.deliveryStatus !== 'Delivered' && o.deliveryStatus !== 'Cancelled'
  ).length;
  const completedOrders = orders?.filter(
    (o: any) => o.deliveryStatus === 'Delivered'
  ).length;

  const { data: notifications, isLoading: areNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/admin/api/get-user-notifications');
      return res.data.notifications;
    },
  });

  const markAsRead = async (notificationId: string) => {
    await axiosInstance.put(`/seller/mark-as-read`, {
      notificationId,
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const base64String = reader.result as string;

          await axiosInstance.post('/api/upload-avatar', {
            fileName: base64String,
          });

          queryClient.invalidateQueries({ queryKey: ['user'] });
          toast.success('Profile photo updated successfully');
        } catch (error) {
          console.error('Failed to upload avatar:', error);
          toast.error('Failed to upload photo');
        } finally {
          setIsUploadingAvatar(false);
          // Reset file input
          e.target.value = '';
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
        setIsUploadingAvatar(false);
        e.target.value = '';
      };
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload photo');
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;

    setIsUploadingAvatar(true);
    try {
      await axiosInstance.delete('/api/remove-avatar');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile photo removed');
    } catch (error) {
      console.error('Failed to remove avatar:', error);
      toast.error('Failed to remove photo');
    } finally {
      setIsUploadingAvatar(false);
    }
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
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
              {activeTab}
            </h2>
            {activeTab === 'Profile' && !isLoading && user ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Image
                      src={user?.avatar?.[0]?.fileUrl || '/images/default-avatar.png'}
                      alt="avatar"
                      width={80}
                      height={80}
                      className="size-20 rounded-full border-2 border-brand-primary-200 object-cover"
                    />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary-600 hover:text-brand-primary-700 bg-brand-primary-50 hover:bg-brand-primary-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ pointerEvents: isUploadingAvatar ? 'none' : 'auto' }}
                    >
                      <Upload className="size-4" />
                      {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    />
                    {user?.avatar && (
                      <button
                        onClick={handleRemoveAvatar}
                        disabled={isUploadingAvatar}
                        className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <X className="size-3" />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-brand-primary-50 to-brand-primary-100 rounded-lg border border-brand-primary-200">
                    <p className="text-sm text-brand-primary-700 mb-1">Earned Points</p>
                    <p className="text-2xl font-bold text-brand-primary-600">
                      {user?.points || 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'Profile' ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary-500" />
              </div>
            ) : null}
            {activeTab === 'Shipping Address' && <ShippingAddressSection />}
            {activeTab === 'My Orders' && (
              <OrdersSection isLoading={isOrdersLoading} orders={orders} />
            )}
            {activeTab === 'Change Password' && <ChangePasswordSection />}
            {activeTab === 'Notifications' && (
              <div className="space-y-4">
                {areNotificationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary-500" />
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications available yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications?.map((notification: any) => (
                      <Link
                        href={notification.redirectLink}
                        key={notification.id}
                        className={`block p-4 rounded-lg border transition-colors ${notification.status !== 'Unread'
                          ? 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-brand-primary-50 border-brand-primary-200 hover:bg-brand-primary-100'
                          }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col flex-1">
                            <span className="font-semibold text-gray-900">
                              {notification.title}
                            </span>
                            <span className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </span>
                            <span className="text-gray-400 text-xs mt-2">
                              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
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
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
};

export default Page;
