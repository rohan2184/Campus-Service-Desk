import { useState, useEffect } from 'react';
import { useTicket } from '../../context/TicketContext';
import { useToast } from '../../context/ToastContext';
import { DndContext, closestCenter, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { KanbanSquare } from 'lucide-react';

const COLUMNS = ['Open', 'In Progress', 'Completed'];

export default function KanbanBoard() {
    const { fetchAllTickets: fetchTickets, updateTicket } = useTicket();
    const { showToast } = useToast();
    
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    // Initialize sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // minimum drag distance before taking effect
            },
        })
    );

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchTickets();
            
            // EOD Cleanup: Hide Completed/Review/Closed tickets that entered that state before today
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            
            const filteredData = data.filter(t => {
                if (['Completed', 'Review', 'Closed'].includes(t.status)) {
                    const entry = t.stateEntryTimestamps?.find(e => e.state === t.status);
                    if (entry && new Date(entry.timestamp) < todayStart) return false;
                    if (!entry && new Date(t.updatedAt) < todayStart) return false;
                }
                return true;
            });
            
            setTickets(filteredData);
        } catch {
            showToast('Failed to load tickets for board', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Calculate derived state: columns object
    const columns = COLUMNS.reduce((acc, status) => {
        // Map 'Completed' column to both 'Completed' and 'Review' state tickets so it doesn't pop out
        if (status === 'Completed') {
            acc[status] = tickets.filter(t => t.status === 'Completed' || t.status === 'Review');
        } else {
            acc[status] = tickets.filter(t => t.status === status);
        }
        return acc;
    }, {});

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeIdStr = String(active.id);
        const overIdStr = String(over.id);

        // Find which column the items belong to
        const getColumnStatus = (id) => {
            const isColumn = COLUMNS.includes(id);
            if (isColumn) return id;
            const ticket = tickets.find(t => t._id === id);
            if (!ticket) return null;
            if (ticket.status === 'Review' || ticket.status === 'Completed') return 'Completed';
            return ticket.status;
        };

        const activeColumn = getColumnStatus(activeIdStr);
        const overColumn = getColumnStatus(overIdStr);

        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            return;
        }

        // Optimistic UI update across columns
        setTickets((prev) => {
            return prev.map(t => {
                if (t._id === activeIdStr) {
                    const mappedStatus = overColumn === 'Completed' ? 'Review' : overColumn;
                    return { ...t, status: mappedStatus };
                }
                return t;
            });
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const ticketId = String(active.id);
        
        // Final destination column
        let finalColumn = over.id;
        if (!COLUMNS.includes(finalColumn)) {
            const tStatus = tickets.find(t => t._id === over.id)?.status;
            finalColumn = (tStatus === 'Review' || tStatus === 'Completed') ? 'Completed' : tStatus;
        }

        const mappedApiStatus = finalColumn === 'Completed' ? 'Review' : finalColumn;

        const originalTicket = tickets.find(t => t._id === ticketId);
        
        if (originalTicket && originalTicket.status !== mappedApiStatus) {
            try {
                // Background update API
                await updateTicket(ticketId, { status: mappedApiStatus });
                showToast(`Ticket moved to ${finalColumn}`, 'success');
            } catch {
                showToast('Failed to move ticket', 'error');
                // Revert state if API fails
                loadData(); 
            }
        }
    };

    if (loading) return <LoadingSpinner message="Loading Kanban Board..." />;

    const activeTicket = tickets.find(t => t._id === activeId);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <KanbanSquare className="text-orange-600" />
                        Ticket Board
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Drag and drop tickets to update their status</p>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 h-full min-w-max">
                        {COLUMNS.map((status) => (
                            <SortableContext 
                                key={status} 
                                id={status}
                                items={columns[status].map(t => t._id)} 
                                strategy={verticalListSortingStrategy}
                            >
                                <KanbanColumn 
                                    status={status} 
                                    tickets={columns[status]} 
                                />
                            </SortableContext>
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTicket ? <KanbanCard ticket={activeTicket} isOverlay /> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
