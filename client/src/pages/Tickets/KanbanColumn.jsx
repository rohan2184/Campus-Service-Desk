import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const STATUS_COLORS = {
    'Open': 'border-l-yellow-500',
    'In Progress': 'border-l-orange-500',
    'Resolved': 'border-l-green-500',
    'Closed': 'border-l-gray-400',
    'Completed': 'border-l-green-500',
};

const STATUS_BG = {
    'Open': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'In Progress': 'bg-orange-50 text-orange-700 border-orange-200',
    'Resolved': 'bg-green-50 text-green-700 border-green-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
};

export function KanbanColumn({ status, tickets }) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div className="flex flex-col w-80 bg-gray-50/50 rounded-xl border border-gray-100 flex-shrink-0 h-full max-h-full">
            {/* Header */}
            <div className={`p-4 border-b rounded-t-xl flex items-center justify-between ${STATUS_BG[status]}`}>
                <h3 className="font-semibold text-sm uppercase tracking-wider">{status}</h3>
                <span className="bg-white/60 px-2.5 py-1 text-xs font-bold rounded-full">
                    {tickets.length}
                </span>
            </div>

            {/* Droppable Area */}
            <div 
                ref={setNodeRef} 
                className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[150px]"
            >
                <SortableContext 
                    id={status}
                    items={tickets.map(t => String(t._id))} 
                    strategy={verticalListSortingStrategy}
                >
                    {tickets.map(ticket => (
                        <KanbanCard 
                            key={ticket._id} 
                            ticket={ticket} 
                            colorAccent={STATUS_COLORS[status]}
                        />
                    ))}
                </SortableContext>
                
                {tickets.length === 0 && (
                    <div className="h-full w-full flex items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-8">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
}
