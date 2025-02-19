import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import api from '~/services/api';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { DataTable } from '~/components';
import { toDDMMYYYY } from '~/utils/functions';

Modal.setAppElement('#root');

const Cases = () => {
    const [processes, setProcesses] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/view-processes');
                console.log('Processes fetched:', response.data);
                setProcesses(response.data);
            } catch (error) {
                console.error('Error fetching processes:', error);
            }
        };
        fetchData();
    }, []);

    const openModal = async (process) => {
        setSelectedProcess(process);
        setModalIsOpen(true);
        try {
            const response = await api.get(`/process/${process.id}/events`);
            console.log(`Events fetched for process ${process.id}:`, response.data);
            setEvents(response.data);
        } catch (error) {
            console.error(`Error fetching events for process ${process.id}:`, error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProcess(null);
        setEvents([]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + (date.getTimezoneOffset() / 60)); // Adjust for timezone offset
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div>
            <DataTable
                columns={[
                    {
                        label: "id",
                        name: "id" 
                    },
                    {
                        label: "Orgão julgador",
                        name: "jurisdicao_nome" 
                    },
                    {
                        label: "Classe",
                        name: "classe_nome" 
                    },
                    {
                        label: "Arquivado",
                        name: "arquivado",
                        render: (data) => <div>{data ? "Sim" : "Não"}</div>
                    },
                    {
                        label: "Início",
                        name: "data_hora_inicio" ,
                        render: (data) => <div>{toDDMMYYYY(data)}</div>
                    },
                ]}
                data={processes}
            />
{/*             <h2>Processos</h2>
            <ul className="process-list">
                {processes.map((process) => (
                    <li key={process.id} className="process-item" onClick={() => openModal(process)}>
                        <div className="process-header">
                            <strong>Processo:</strong> {process.numero_unico}
                        </div>
                        <div className="process-body">
                            <p><strong>Classe:</strong> {process.classe_nome}</p>
                            <p><strong>Órgão Julgador:</strong> {process.orgao_julgador}</p>
                        </div>
                    </li>
                ))}
            </ul> */}

{/*             <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Detalhes do Processo"
                className="Modal"
                overlayClassName="Overlay"
            >
                {selectedProcess && (
                    <div>
                        <h2>Detalhes do Processo</h2>
                        <Tabs>
                            <TabList>
                                <Tab>Informações</Tab>
                                <Tab>Eventos</Tab>
                            </TabList>

                            <TabPanel>
                                <p><strong>Processo:</strong> {selectedProcess.numero_unico}</p>
                                <p><strong>Classe:</strong> {selectedProcess.classe_nome}</p>
                                <p><strong>Órgão Julgador:</strong> {selectedProcess.orgao_julgador}</p>
                                <p><strong>Partes:</strong></p>
                                <ul>
                                    {selectedProcess.partes && selectedProcess.partes.length > 0 ? selectedProcess.partes.map((parte) => (
                                        parte && <li key={parte.id}>{parte.nome} ({parte.polo})</li>
                                    )) : <li>Sem partes</li>}
                                </ul>
                                <p><strong>Advogados:</strong></p>
                                <ul>
                                    {selectedProcess.advogados && selectedProcess.advogados.length > 0 ? selectedProcess.advogados.map((advogado) => (
                                        advogado && <li key={advogado.id}>{advogado.nome} (OAB: {advogado.numero_oab} / {advogado.uf_oab || 'N/A'})</li>
                                    )) : <li>Sem advogados</li>}
                                </ul>
                            </TabPanel>
                            <TabPanel>
                                <p><strong>Eventos:</strong></p>
                                <ul>
                                    {events && events.length > 0 ? events.map((evento) => (
                                        evento && <li key={evento.id}>
                                            <strong>Data:</strong> {formatDate(evento.data)}<br/>
                                            <strong>Descrição:</strong> {evento.descricao}<br/>
                                            <strong>Tipo:</strong> {evento.tipo}
                                        </li>
                                    )) : <li>Sem eventos</li>}
                                </ul>
                            </TabPanel>
                        </Tabs>
                        <button onClick={closeModal}>Fechar</button>
                    </div>
                )}
            </Modal> */}
        </div>
    );
};

export default Cases;
