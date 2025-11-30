import { LucideIcon, PackageOpen } from 'lucide-react';
import React from 'react';

interface Props {
    title?: string;
    message?: string;
    icon?: LucideIcon;
    minHeight?: string;
}

const EmptyState = ({
    title = 'No items found',
    message = 'We couldn\'t find what you were looking for.',
    icon: Icon = PackageOpen,
    minHeight = 'h-[250px]',
}: Props) => {
    return (
        <div
            className={`w-full ${minHeight} flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 col-span-full`}
        >
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-xs">{message}</p>
        </div>
    );
};

export default EmptyState;
