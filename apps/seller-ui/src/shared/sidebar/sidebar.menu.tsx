import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 mb-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default SidebarMenu;
