import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import CustomCalendar from '../../components/CustomCalendar/CustomCalendar';
import api from '~/services/api';
import { DataTable } from '~/components';
import { toDDMMYYYY } from '~/utils/functions';
import Show from './Modals/Show';

Modal.setAppElement('#root');

const Notifications = () => {

    const showModalRef = useRef<any>(null)

    const [notifications, setNotifications] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        const fetchData = async (date) => {
            try {
                let dateString = date.toISOString().split('T')[0];
                const response = await api.get('/view-notifications', {
                    params: {
                        dateString,
                    },
                });
                console.log('Notifications fetched:', response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchData(selectedDate);
    }, [selectedDate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + (date.getTimezoneOffset() / 60)); // Adjust for timezone offset
        return date.toLocaleDateString('pt-BR');
    };

    const openModal = (notification) => {
        setSelectedNotification(notification);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div>
            <Show ref={showModalRef} />

            <DataTable
                onView={(data, row) => showModalRef.current.show(row)}
                columns={[
                    {
                        label: "id",
                        name: "id" 
                    },
                    {
                        label: "tribunal",
                        name: "siglatribunal" 
                    },
                    {
                        label: "Orgão",
                        name: "nomeorgao" 
                    },
                    {
                        label: "Destinatários",
                        name: "destinatarios",
                        render: (data) => <div>{data.length}</div>
                    },
                    {
                        label: "Data",
                        name: "data_disponibilizacao",
                        render: (data) => <div>{toDDMMYYYY(data)}</div>
                    },
                ]}
                data={notifications}
            />
{/*             <h2>Notificações</h2>
            <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <ul className="notification-list">
                {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item" onClick={() => openModal(notification)}>
                        <div className="notification-header">
                            <strong>Data:</strong> {formatDate(notification.data_disponibilizacao)}
                        </div>
                        <div className="notification-body">
                            <strong>Processo:</strong> {notification.numeroprocessocommascara}
                            <strong>Tribunal:</strong> {notification.siglatribunal}
                            <strong>Órgão:</strong> {notification.nomeorgao}
                            <strong>Destinatários:</strong>
                            <ul>
                                {notification.destinatarios && notification.destinatarios.length > 0 ? notification.destinatarios.map((destinatario) => (
                                    destinatario && <li key={destinatario.id}>{destinatario.nome} ({destinatario.polo})</li>
                                )) : <li>Sem destinatários</li>}
                            </ul>
                            <strong>Advogados Destinatários:</strong>
                            <ul>
                                {notification.destinatario_advogados && notification.destinatario_advogados.length > 0 ? notification.destinatario_advogados.map((advogado) => (
                                    advogado && <li key={advogado.id}>{advogado.nome} (OAB: {advogado.numero_oab} / {advogado.uf_oab || 'N/A'})</li>
                                )) : <li>Sem advogados destinatários</li>}
                            </ul>
                            <strong>Texto:</strong> {notification.texto}
                            <a href={notification.link} target="_blank" rel="noopener noreferrer">Link para o documento</a>
                        </div>
                    </li>
                ))}
            </ul>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Detalhes da Notificação"
                className="Modal"
                overlayClassName="Overlay"
            >
                {selectedNotification && (
                    <div>
                        <h2>Detalhes da Notificação</h2>
                        <p><strong>Data:</strong> {formatDate(selectedNotification.data_disponibilizacao)}</p>
                        <p><strong>Processo:</strong> {selectedNotification.numeroprocessocommascara}</p>
                        <p><strong>Tribunal:</strong> {selectedNotification.siglatribunal}</p>
                        <p><strong>Órgão:</strong> {selectedNotification.nomeorgao}</p>
                        <p><strong>Destinatários:</strong></p>
                        <ul>
                            {selectedNotification.destinatarios && selectedNotification.destinatarios.length > 0 ? selectedNotification.destinatarios.map((destinatario) => (
                                destinatario && <li key={destinatario.id}>{destinatario.nome} ({destinatario.polo})</li>
                            )) : <li>Sem destinatários</li>}
                        </ul>
                        <p><strong>Advogados Destinatários:</strong></p>
                        <ul>
                            {selectedNotification.destinatario_advogados && selectedNotification.destinatario_advogados.length > 0 ? selectedNotification.destinatario_advogados.map((advogado) => (
                                advogado && <li key={advogado.id}>{advogado.nome} (OAB: {advogado.numero_oab} / {advogado.uf_oab || 'N/A'})</li>
                            )) : <li>Sem advogados destinatários</li>}
                        </ul>
                        <p><strong>Texto:</strong> {selectedNotification.texto}</p>
                        <a href={selectedNotification.link} target="_blank" rel="noopener noreferrer">Link para o documento</a>
                        <button onClick={closeModal}>Fechar</button>
                    </div>
                )}
            </Modal> */}
        </div>
    );
};

export default Notifications;
