export default function PriorityBadge({ priority }) {
    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'High':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getDot = (priority) => {
        switch (priority) {
            case 'Urgent': return 'bg-red-500';
            case 'High': return 'bg-orange-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityStyles(priority)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getDot(priority)}`}></span>
            {priority}
        </span>
    );
}
