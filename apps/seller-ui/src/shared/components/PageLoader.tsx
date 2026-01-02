import { Loader2 } from 'lucide-react';
import React from 'react';

const PageLoader = () => {
    return (
        <div className="w-full h-full min-h-[50vh] flex items-center justify-center">
            <Loader2 size={40} className="animate-spin text-brand-primary-600" />
        </div>
    );
};

export default PageLoader;
