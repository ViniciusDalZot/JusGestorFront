import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Modal from 'react-modal';
import api from '~/services/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toDDMMYYYY } from '~/utils/functions';
import Show from './Modals/Show';
import ptBr from '@fullcalendar/core/locales/pt-br';
import { Spinner } from '~/components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

Modal.setAppElement('#root');

const FilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const Notifications = () => {
    const showModalRef = useRef<any>(null);
    const calendarRef = useRef<FullCalendar>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [dailyNotifications, setDailyNotifications] = useState<any[]>([]);
    const [monthLoading, setMonthLoading] = useState(false);
    const [dailyLoading, setDailyLoading] = useState(false);
    const [tribunais, setTribunais] = useState<any[]>([]);
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const [currentMonth, setCurrentMonth] = useState<{ start: string; end: string }>({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
    });

    const [filters, setFilters] = useState({
        status: '',
        siglaTribunal: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [tribunaisRes, statusRes] = await Promise.all([
                    api.get('/tribunais'),
                    api.get('/notificacoes/status')
                ]);
                setTribunais(tribunaisRes.data);
                setStatusOptions(statusRes.data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchInitialData();
    }, []);

    const fetchMonthNotifications = useCallback(async () => {
        setMonthLoading(true);
        try {
            const params = {
                dataInicio: currentMonth.start.split('T')[0],
                dataFim: currentMonth.end.split('T')[0],
                status: filters.status,
                siglaTribunal: filters.siglaTribunal
            };

            const { data } = await api.get('/notificacoes', { params });
            setNotifications(data?.items || []);
            
        } catch (error) {
            console.error('Erro ao buscar notificações mensais:', error);
        } finally {
            setMonthLoading(false);
        }
    }, [currentMonth, filters]);

    const fetchDailyNotifications = useCallback(async (date: Date) => {
        setDailyLoading(true);
        try {
            const params = {
                dataInicio: date.toISOString().split('T')[0],
                dataFim: date.toISOString().split('T')[0],
                status: filters.status,
                siglaTribunal: filters.siglaTribunal
            };

            const { data } = await api.get('/notificacoes', { params });
            setDailyNotifications(data?.items || []);
            
        } catch (error) {
            console.error('Erro ao buscar notificações diárias:', error);
        } finally {
            setDailyLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchMonthNotifications();
    }, [fetchMonthNotifications]);

    useEffect(() => {
        fetchDailyNotifications(selectedDate);
    }, [selectedDate, fetchDailyNotifications]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = useCallback((days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    }, [selectedDate]);

    const handleCalendarDateClick = useCallback((arg: any) => {
        const clickedDate = new Date(arg.date);
        setSelectedDate(clickedDate);
    }, []);

    const markAsRead = useCallback(async (id: number) => {
        try {
            await api.put(`/notificacoes/${id}/lida`);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, lida: true } : n)
            );
            setDailyNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, lida: true } : n)
            );
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    }, []);

    const handleViewNotification = useCallback((notification: any) => {
        if (!notification.lida) markAsRead(notification.id);
        showModalRef.current.show(notification);
    }, [markAsRead]);

    const calendarEvents = useMemo(() => 
        notifications.reduce((acc: any[], notification) => {
            const eventDate = new Date(notification.data_disponibilizacao).toISOString().split('T')[0];
            const existingEvent = acc.find(e => e.start === eventDate);
            
            if (existingEvent) {
                existingEvent.count++;
                if (!notification.lida) existingEvent.unread++;
            } else {
                acc.push({
                    start: eventDate,
                    allDay: true,
                    count: 1,
                    unread: notification.lida ? 0 : 1,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    classNames: ['event-point'],
                    display: 'background' 
                });
            }
            return acc;
        }, []),
    [notifications]);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="p-4 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Calendário de Intimações</h1>
                        <p className="text-sm text-gray-600">
                            {toDDMMYYYY(selectedDate)}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => handleDateChange(-1)}
                                className="p-2 hover:bg-gray-200 rounded-lg"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    setSelectedDate(today);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Hoje
                            </button>
                            
                            <button
                                onClick={() => handleDateChange(1)}
                                className="p-2 hover:bg-gray-200 rounded-lg"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 flex-1">
                <div className="bg-white rounded-xl shadow-lg p-4 h-fit lg:sticky lg:top-4">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={ptBr}
                        events={calendarEvents}
                        dateClick={handleCalendarDateClick}
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'today'
                        }}
                        datesSet={(arg) => {
                            setCurrentMonth({
                                start: arg.startStr,
                                end: arg.endStr
                            });
                        }}
                        height="auto"
                        eventContent={(eventInfo) => (
                            <div className="flex flex-col items-center p-1 pointer-events-none">
                                <div className="relative">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                                        ${eventInfo.event.extendedProps.unread > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                                        <span className={`text-sm ${eventInfo.event.extendedProps.unread > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {eventInfo.event.extendedProps.count}
                                        </span>
                                    </div>
                                    {eventInfo.event.extendedProps.unread > 0 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white 
                                            text-xs rounded-full flex items-center justify-center">
                                            {eventInfo.event.extendedProps.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                    />
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilterField label="Status">
                                <select 
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full p-2 text-sm border rounded-md"
                                >
                                    <option value="">Todos</option>
                                    {statusOptions.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FilterField>

                            <FilterField label="Tribunal">
                                <select 
                                    value={filters.siglaTribunal}
                                    onChange={(e) => handleFilterChange('siglaTribunal', e.target.value)}
                                    className="w-full p-2 text-sm border rounded-md"
                                >
                                    <option value="">Todos</option>
                                    {tribunais.map((tribunal) => (
                                        <option key={tribunal.sigla} value={tribunal.sigla}>
                                            {tribunal.sigla} - {tribunal.nome}
                                        </option>
                                    ))}
                                </select>
                            </FilterField>
                        </div>
                    </div>

                    {dailyLoading ? (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                              <Spinner size="lg" color="primary" />
                        </div>
                    ) : dailyNotifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                            Nenhuma intimação encontrada para esta data
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {dailyNotifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    onClick={() => handleViewNotification(notification)}
                                    className={`relative bg-white p-4 rounded-xl shadow-lg cursor-pointer transition-all
                                        hover:shadow-xl border-l-4 ${
                                            notification.lida ? 'border-green-500' : 'border-red-500'
                                        }`}
                                >
                                    {!notification.lida && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                    
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${
                                            notification.lida ? 'bg-green-100' : 'bg-red-100'
                                        } flex items-center justify-center`}>
                                            <span className={`text-lg ${
                                                notification.lida ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                ⚖️
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {notification.siglatribunal}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {notification.nomeorgao}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="text-sm">
                                            <p className="text-gray-600 font-medium break-words">
                                                {notification.numeroprocessocommascara}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {toDDMMYYYY(notification.data_disponibilizacao)}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="inline-flex items-center gap-1 text-gray-600">
                                                👤 {notification.destinatarios?.length || 0}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                notification.lida 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {notification.lida ? 'Lida' : 'Não lida'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Show ref={showModalRef} />
        </div>
    );
};

export default Notifications;