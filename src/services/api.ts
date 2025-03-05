import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
});

export default api;


/* export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const register = async (userData) => {
    return api.post('/auth/register', userData);
};

export const getProcesses = async () => {
    return api.get('/view-processes');
};

export const getNotifications = async (date) => {
    return api.get('/view-notifications', {
        params: {
            date,
        },
    });
};

export const getEventsByProcessId = async (processId) => {
    return api.get(`/process/${processId}/events`);
};

export const getCompromissos = async () => {
    const response = await api.get('/compromissos');
    return response.data;
};

export const createCompromisso = async (data) => {
    const response = await api.post('/compromissos', data);
    return response.data;
};

export const updateCompromisso = async (id, data) => {
    const response = await api.put(`/compromissos/${id}`, data);
    return response.data;
};

export const deleteCompromisso = async (id) => {
    const response = await api.delete(`/compromissos/${id}`);
    return response.data;
};

export const getDashboardTotals = async () => {
    const response = await api.get('/dashboard/totals');
    return response.data;
};

export const getAdvogadoProcessos = async () => {
    const response = await api.get('/processos/advogado-processos');
    return response.data;
};

export const getClients = async () => {
    const response = await api.get('/view-clients');
    return response.data;
};

export const getUserRole = async () => {
    const response = await api.get('/auth/role');
    return response.data.role;
};

export const logout = () => {
    localStorage.removeItem('authToken');
};

const apiService = {
    login,
    register,
    getProcesses,
    getNotifications,
    getEventsByProcessId,
    getCompromissos,
    createCompromisso,
    updateCompromisso,
    deleteCompromisso,
    getClients,
    getUserRole,
    getDashboardTotals,
    getAdvogadoProcessos,
    logout,
};

export default apiService;
 */