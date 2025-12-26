'use client';

import useAdmin from 'apps/admin-ui/src/hooks/useAdmin';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RiDashboardLine,
  RiFileList3Line,
  RiWallet3Line,
  RiBox3Line,
  RiCalendarEventLine,
  RiGroupLine,
  RiStore2Line,
  RiFileHistoryLine,
  RiSettings4Line,
  RiNotificationBadgeLine,
  RiPantoneLine,
  RiLogoutBoxRLine,
  RiShoppingBag3Fill,
} from 'react-icons/ri';
import SidebarMenu from './SidebarMenu';
import Box from '../Box';
import { Sidebar } from './sidebar.styles';
import SidebarItem from './SidebarItem';
import { useSidebar } from '../../hooks/useSidebar';

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const { admin } = useAdmin();
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
              Admin Portal
            </span>
          </div>
        </Link>

        {admin?.shop && (
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary-50 flex items-center justify-center text-brand-primary-600 font-bold text-xs border border-brand-primary-100">
                {admin.shop.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {admin.shop.name}
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  {admin.shop.address}
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

              <SidebarItem
                isActive={activeSidebar === '/dashboard/products'}
                title="Products"
                href="/dashboard/products"
                icon={
                  <RiBox3Line
                    fill={getIconColor('/dashboard/products')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/events'}
                title="Events"
                href="/dashboard/events"
                icon={
                  <RiCalendarEventLine
                    fill={getIconColor('/dashboard/events')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/users'}
                title="Users"
                href="/dashboard/users"
                icon={
                  <RiGroupLine fill={getIconColor('/dashboard/users')} size={22} />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/sellers'}
                title="Sellers"
                href="/dashboard/sellers"
                icon={
                  <RiStore2Line fill={getIconColor('/dashboard/sellers')} size={22} />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/loggers'}
                title="Loggers"
                href="/dashboard/loggers"
                icon={
                  <RiFileHistoryLine
                    fill={getIconColor('/dashboard/loggers')}
                    size={22}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === '/dashboard/management'}
                title="Management"
                href="/dashboard/management"
                icon={
                  <RiSettings4Line
                    fill={getIconColor('/dashboard/management')}
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
            <SidebarMenu title="Customization">
              <SidebarItem
                isActive={activeSidebar === '/dashboard/customization'}
                title="All Customizations"
                href="/dashboard/customization"
                icon={
                  <RiPantoneLine
                    fill={getIconColor('/dashboard/customization')}
                    size={26}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Extra">
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
