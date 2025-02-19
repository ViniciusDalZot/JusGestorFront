import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '~/services/api';

const ModalCompromisso = ({ show, handleClose, compromisso, refreshCompromissos }) => {
    const [formValues, setFormValues] = useState({
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        notificacao: '',
        status: '',
        tipo_evento: '',
        observacao: '',
        cliente_id: '',
        processo_id: ''
    });

    const [processos, setProcessos] = useState([]);

    useEffect(() => {
        if (compromisso) {
            setFormValues({
                titulo: compromisso.titulo || '',
                descricao: compromisso.descricao || '',
                data_inicio: compromisso.data_inicio ? compromisso.data_inicio.split('.')[0] : '',
                data_fim: compromisso.data_fim ? compromisso.data_fim.split('.')[0] : '',
                notificacao: compromisso.notificacao ? compromisso.notificacao.split('.')[0] : '',
                status: compromisso.status || '',
                tipo_evento: compromisso.tipo_evento || '',
                observacao: compromisso.observacao || '',
                cliente_id: compromisso.cliente_id || '',
                processo_id: compromisso.processo_id || ''
            });
        } else {
            setFormValues({
                titulo: '',
                descricao: '',
                data_inicio: '',
                data_fim: '',
                notificacao: '',
                status: '',
                tipo_evento: '',
                observacao: '',
                cliente_id: '',
                processo_id: ''
            });
        }
    }, [compromisso]);

    useEffect(() => {
        const fetchProcessos = async () => {
            try {
                const processosData: any = await api.get('/processos/advogado-processos');
                setProcessos(processosData);
            } catch (error) {
                console.error('Erro ao buscar processos:', error);
            }
        };

        fetchProcessos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const values = { ...formValues };
            if (values.cliente_id === '') values.cliente_id = null;
            if (values.processo_id === '') values.processo_id = null;

            if (compromisso) {
                await api.put(`/compromissos/${compromisso.id}`, values);
            } else {
                await api.post('/compromissos', values);
            }
            refreshCompromissos();
            handleClose();
        } catch (error) {
            console.error('Erro ao salvar compromisso:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} className="modal-compromisso">
            <Modal.Header closeButton>
                <Modal.Title>{compromisso ? 'Editar Compromisso' : 'Adicionar Compromisso'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="titulo">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            value={formValues.titulo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="descricao">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            name="descricao"
                            value={formValues.descricao}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="data_inicio">
                        <Form.Label>Data de Início</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="data_inicio"
                            value={formValues.data_inicio}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="data_fim">
                        <Form.Label>Data de Fim</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="data_fim"
                            value={formValues.data_fim}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="notificacao">
                        <Form.Label>Notificação</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="notificacao"
                            value={formValues.notificacao}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formValues.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Aberto">Aberto</option>
                            <option value="Fechado">Fechado</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="tipo_evento">
                        <Form.Label>Tipo de Evento</Form.Label>
                        <Form.Control
                            as="select"
                            name="tipo_evento"
                            value={formValues.tipo_evento}
                            onChange={handleChange}
                            required
                        >
                            <option value="Evento Google">Evento Google</option>
                            <option value="Prazo a Cumprir">Prazo a Cumprir</option>
                            <option value="Intimações">Intimações</option>
                            <option value="Eventos Gerais">Eventos Gerais</option>
                            <option value="Reuniões">Reuniões</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Audiência">Audiência</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="observacao">
                        <Form.Label>Observação</Form.Label>
                        <Form.Control
                            type="text"
                            name="observacao"
                            value={formValues.observacao}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="cliente_id">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control
                            type="number"
                            name="cliente_id"
                            value={formValues.cliente_id}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="processo_id">
                        <Form.Label>Processo</Form.Label>
                        <Form.Control
                            as="select"
                            name="processo_id"
                            value={formValues.processo_id}
                            onChange={handleChange}
                        >
                            <option value="">Selecione um Processo</option>
                            {processos.map((processo) => (
                                <option key={processo.id} value={processo.id}>
                                    {processo.numero_unico}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCompromisso;
