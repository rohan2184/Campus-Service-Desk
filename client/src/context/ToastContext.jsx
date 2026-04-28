import { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={18} />;
            case 'error': return <XCircle size={18} />;
            case 'info': return <Info size={18} />;
            default: return <Info size={18} />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
                return 'bg-orange-50 border-orange-200 text-orange-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            case 'info': return 'text-orange-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" style={{ maxWidth: '380px' }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getStyles(toast.type)}`}
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        <span className={getIconColor(toast.type)}>
                            {getIcon(toast.type)}
                        </span>
                        <span className="text-sm font-medium flex-1">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-50 hover:opacity-100 transition"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Inline animation keyframes */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
