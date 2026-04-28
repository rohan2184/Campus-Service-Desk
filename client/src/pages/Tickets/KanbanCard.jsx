import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PriorityBadge from '../../components/PriorityBadge';
import { Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const timeAgo = (date) => {
    const secs = Math.floor((new Date() - new Date(date)) / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export function KanbanCard({ ticket, colorAccent, isOverlay }) {
    const navigate = useNavigate();
    
    // Sortable hooks
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(ticket._id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStateTimestamp = () => {
        if (!ticket.stateEntryTimestamps || ticket.stateEntryTimestamps.length === 0) {
            return new Date(ticket.updatedAt);
        }
        const entry = ticket.stateEntryTimestamps.slice().reverse().find(e => e.state === ticket.status);
        if (entry) return new Date(entry.timestamp);
        return new Date(ticket.updatedAt);
    };

    const isStagnant = (() => {
        if (['Resolved', 'Closed', 'Completed', 'Review'].includes(ticket.status)) return false;
        const timeLimit = 24 * 60 * 60 * 1000; // 24 hours
        return (Date.now() - getStateTimestamp().getTime()) > timeLimit;
    })();

    if (isDragging && !isOverlay) {
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                className="w-full h-28 bg-orange-50/50 border-2 border-orange-300 border-dashed rounded-lg opacity-50"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => !isDragging && navigate(`/dashboard/tickets/${ticket._id}`)}
            className={`bg-white p-3 rounded-lg shadow-sm border ${isStagnant ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-100'} cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative overflow-hidden group ${
                isOverlay ? `shadow-xl scale-105 rotate-2 cursor-grabbing z-50 ${isStagnant ? 'ring-2 ring-red-300' : ''}` : ''
            }`}
        >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorAccent}`} />

            <div className="pl-1">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                        {ticket.ticketID}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                </div>

                <h4 className="text-sm font-semibold text-gray-800 leading-tight mb-2 line-clamp-2">
                    {ticket.title}
                </h4>

                <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-50">
                    <div className={`flex items-center gap-1.5 ${isStagnant ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {isStagnant ? <AlertTriangle size={12} className="text-red-500" /> : <Clock size={12} />}
                        {timeAgo(ticket.updatedAt)}
                    </div>
                    
                    {/* Assigned User Avatar */}
                    {ticket.assignedTo ? (
                        <div 
                            className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-[9px] font-bold"
                            title={`Assigned to ${ticket.assignedTo.name}`}
                        >
                            {getInitials(ticket.assignedTo.name)}
                        </div>
                    ) : (
                        <div className="text-[10px] text-gray-400 italic">Unassigned</div>
                    )}
                </div>
            </div>
            
            {/* View overlay hint on hover */}
            <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                <span className="bg-white px-2 py-1 rounded shadow-sm text-[10px] font-medium text-orange-600 border border-orange-100 translates-y-2 group-hover:translate-y-0 transition-transform">
                    Click to view
                </span>
            </div>
        </div>
    );
}

export default KanbanCard;
