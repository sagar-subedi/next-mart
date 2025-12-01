'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ConditionalLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const authPages = ['/login', '/signup', '/forgot-password'];
    const isAuthPage = authPages.includes(pathname);

    // Hide footer on auth pages
    if (isAuthPage) {
        const childrenArray = Array.isArray(children) ? children : [children];
        // Filter out Footer component
        return <>{childrenArray.filter((child, index) => index !== childrenArray.length - 1)}</>;
    }

    return <>{children}</>;
}
