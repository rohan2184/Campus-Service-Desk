// API Configuration
// Vite uses import.meta.env for environment variables. Ensure variables are prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
