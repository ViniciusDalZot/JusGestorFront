import React from 'react';
import Modal from 'react-modal';
import '../css/ProcessModal.css';

const ProcessModal = ({ process, onClose }) => {
    return (
        <Modal isOpen={!!process} onRequestClose={onClose} contentLabel="Detalhes do Processo">
            <div className="modal-content">
                <h2>Detalhes do Processo</h2>
                <button onClick={onClose} className="modal-close-button">X</button>
                <div className="modal-body">
                    <strong>Processo:</strong> {process.numero_unico}<br />
                    <strong>Classe:</strong> {process.classe_nome}<br />
                    <strong>Órgão Julgador:</strong> {process.orgao_julgador}<br />
                    <strong>Último Evento:</strong> {process.ultimo_evento_descricao}<br />
                    <strong>Data do Último Evento:</strong> {new Date(process.ultimo_evento_data).toLocaleDateString('pt-BR')}<br />
                    {/* Adicione mais detalhes conforme necessário */}
                </div>
            </div>
        </Modal>
    );
};

export default ProcessModal;
