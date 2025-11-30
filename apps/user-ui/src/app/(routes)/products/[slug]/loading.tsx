import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-brand-primary-500 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-brand-primary-200 rounded-full"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading product details...</p>
            </div>
        </div>
    );
}
