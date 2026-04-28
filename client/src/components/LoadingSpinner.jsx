import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-orange-600 mb-3" size={32} />
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
}
