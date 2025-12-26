'use client';

import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import { useSidebar } from 'apps/seller-ui/src/hooks/useSidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Box from '../box';
import { Sidebar } from './sidebar.styles';
import Link from 'next/link';
import SidebarItem from './sidebar.item';
import {
  RiDashboardLine,
  RiFileList3Line,
  RiWallet3Line,
  RiAddBoxLine,
  RiBox3Line,
  RiCalendarEventLine,
  RiCalendarTodoLine,
  RiMailLine,
  RiSettings4Line,
  RiNotificationBadgeLine,
  RiCoupon3Line,
  RiLogoutBoxRLine,
  RiShoppingBag3Fill,
} from 'react-icons/ri';
import SidebarMenu from './sidebar.menu';

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const { seller } = useSeller();
  const pathname = usePathname();

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? '#3b82f6' : '#94a3b8';

  return (
    <Box
      className="sidebar-wrapper"
    >
      <Sidebar.GradientBorder />
      <Sidebar.Header>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-highlight-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <RiShoppingBag3Fill className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary-600 to-brand-highlight-600">
              Doko Mart
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Seller Portal
            </span>
          </div>
        </Link>

        {seller?.shop && (
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary-50 flex items-center justify-center text-brand-primary-600 font-bold text-xs border border-brand-primary-100">
                {seller.shop.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {seller.shop.name}
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  {seller.shop.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={
              <RiDashboardLine fill={getIconColor('/dashboard')} size={22} />
            }
            isActive={activeSidebar === 'dashboard'}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/orders'}
                title="Orders"
                href="/dashboard/orders"
                icon={
                  <RiFileList3Line fill={getIconColor('/dashboard/orders')} size={22} />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/payments'}
                title="Payments"
                href="/dashboard/payments"
                icon={
                  <RiWallet3Line
                    fill={getIconColor('/dashboard/payments')}
                    size={22}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/create-product'}
                title="Create Product"
                href="/dashboard/create-product"
                icon={
                  <RiAddBoxLine
                    fill={getIconColor('/dashboard/create-product')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/all-products'}
                title="All Products"
                href="/dashboard/all-products"
                icon={
                  <RiBox3Line
                    fill={getIconColor('/dashboard/all-products')}
                    size={22}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/create-event'}
                title="Create Event"
                href="/dashboard/create-event"
                icon={
                  <RiCalendarEventLine
                    fill={getIconColor('/dashboard/create-event')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/all-events'}
                title="All Events"
                href="/dashboard/all-events"
                icon={
                  <RiCalendarTodoLine
                    fill={getIconColor('/dashboard/all-events')}
                    size={22}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/inbox'}
                title="Inbox"
                href="/dashboard/inbox"
                icon={
                  <RiMailLine fill={getIconColor('/dashboard/inbox')} size={22} />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/settings'}
                title="Settings"
                href="/dashboard/settings"
                icon={
                  <RiSettings4Line
                    fill={getIconColor('/dashboard/settings')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/notifications'}
                title="Notifications"
                href="/dashboard/notifications"
                icon={
                  <RiNotificationBadgeLine
                    fill={getIconColor('/dashboard/notifications')}
                    size={26}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/discount-codes'}
                title="Discount Codes"
                href="/dashboard/discount-codes"
                icon={
                  <RiCoupon3Line
                    fill={getIconColor('/dashboard/discount-codes')}
                    size={26}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/logout'}
                title="Logout"
                href="/"
                icon={
                  <RiLogoutBoxRLine fill={getIconColor('/dashboard/logout')} size={26} />
                }
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
