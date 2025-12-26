import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({ title, icon, href, isActive }: Props) => {
  return (
    <Link href={href} className="block group">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
          ? 'bg-brand-primary-50 text-brand-primary-600 shadow-sm'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary-500 rounded-r-full" />
        )}
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </div>
        <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-brand-primary-600' : 'text-slate-500 group-hover:text-slate-900'}`}>
          {title}
        </span>
      </div>
    </Link>
  );
};

export default SidebarItem;
