'use client';

import { useQuery } from '@tanstack/react-query';
import Breadcrumb from 'apps/seller-ui/src/shared/components/Breadcrumb';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import Link from 'next/link';
import { useState } from 'react';

const Page = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/seller/api/seller-notifications');
      return res.data.notifications;
    },
  });

  const markAsRead = async (notificationId: string) => {
    await axiosInstance.put(`/seller/api/mark-as-read/${notificationId}`);
  };

  return (
    <div className="w-full min-h-screen p-8">
      <h2 className="text-2xl text-slate-900 font-semibold mb-2">Notifications</h2>
      <Breadcrumb title="Notifications" />
      {isLoading ? (
        <p className="text-center pt-24 text-slate-500 text-sm font-poppins">
          Loading...
        </p>
      ) : data?.length > 0 ? (
        <div className="md:w-[80%] my-6 rounded-lg divide-y divide-slate-100 bg-white shadow-sm border border-slate-200">
          {data.map((notification: any) => (
            <Link
              href={notification.redirectLink ?? '#'}
              key={notification.id}
              className={`block px-6 py-5 transition ${notification.status !== 'Unread'
                ? 'bg-white hover:bg-slate-50'
                : 'bg-blue-50/50 hover:bg-blue-50'
                }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.status === 'Unread' ? 'bg-brand-primary-500' : 'bg-transparent'}`} />
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <span className={`font-medium text-base ${notification.status === 'Unread' ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </span>
                    <span className="text-slate-400 text-xs whitespace-nowrap ml-4">
                      {new Date(notification.createdAt).toLocaleString(
                        'en-UK',
                        { dateStyle: 'medium', timeStyle: 'short' }
                      )}
                    </span>
                  </div>
                  <span className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {notification.message}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center pt-24 text-slate-500 text-sm font-poppins">
          No notifications available yet!
        </p>
      )}
    </div>
  );
};

export default Page;
