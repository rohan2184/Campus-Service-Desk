export default function StatusBadge({ status }) {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'In Progress':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Resolved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Closed':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getDot = (status) => {
        switch (status) {
            case 'Open': return 'bg-yellow-500';
            case 'In Progress': return 'bg-orange-500';
            case 'Resolved': return 'bg-green-500';
            case 'Closed': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getDot(status)}`}></span>
            {status}
        </span>
    );
}
