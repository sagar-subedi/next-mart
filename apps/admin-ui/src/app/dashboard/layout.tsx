import SidebarWrapper from 'apps/admin-ui/src/components/sidebar';
import React, { ReactNode } from 'react';

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex min-h-screen bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      <aside className="w-72 hidden md:block">
        <SidebarWrapper />
      </aside>
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
