import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const TicketContext = createContext();

export const useTicket = () => useContext(TicketContext);

// Axios instance with auth interceptor
const authAxios = axios.create({
    baseURL: API_BASE_URL,
});

authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tickets for logged-in user (student)
    const fetchMyTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authAxios.get('/tickets/my-tickets');
            setTickets(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tickets');
        }
        setLoading(false);
    };

    // Fetch all tickets (staff/admin)
    const fetchAllTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authAxios.get('/tickets');
            setTickets(res.data);
            setLoading(false);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch tickets');
            setLoading(false);
            throw err;
        }
    };

    // Create a new ticket
    const createTicket = async (ticketData) => {
        const res = await authAxios.post('/tickets', ticketData);
        setTickets([res.data, ...tickets]);
        return res.data;
    };

    // Fetch a single ticket by ID
    const fetchTicket = async (id) => {
        const res = await authAxios.get(`/tickets/${id}`);
        return res.data;
    };

    // Update ticket (status, priority, etc.)
    const updateTicket = async (id, data) => {
        const res = await authAxios.put(`/tickets/${id}`, data);
        setTickets(tickets.map(t => t._id === id ? res.data : t));
        return res.data;
    };

    // Update ticket status (convenience wrapper)
    const updateTicketStatus = async (id, status) => {
        return updateTicket(id, { status });
    };

    // Add comment to ticket
    const addComment = async (ticketId, content) => {
        const res = await authAxios.post(`/tickets/${ticketId}/comments`, { content });
        setTickets(tickets.map(t => t._id === ticketId ? res.data : t));
        return res.data;
    };

    // Delete a ticket
    const deleteTicket = async (id) => {
        await authAxios.delete(`/tickets/${id}`);
        setTickets(tickets.filter(t => t._id !== id));
    };

    // Submit feedback to close a ticket
    const submitFeedback = async (id, rating, feedbackText) => {
        const res = await authAxios.post(`/tickets/${id}/feedback`, { rating, feedbackText });
        setTickets(tickets.map(t => t._id === id ? res.data : t));
        return res.data;
    };

    return (
        <TicketContext.Provider value={{
            tickets,
            loading,
            error,
            fetchMyTickets,
            fetchAllTickets,
            createTicket,
            fetchTicket,
            updateTicket,
            updateTicketStatus,
            addComment,
            deleteTicket,
            submitFeedback
        }}>
            {children}
        </TicketContext.Provider>
    );
};
