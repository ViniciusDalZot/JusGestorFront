import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '~/services/api';
import { DataTable } from '~/components/DataTable';
import { Spinner } from '~/components/Spinner';
import { Modal } from '~/components/Modal'; // Exemplo
import ProcessModal from './ProcessModal';
import { FilterField } from '~/components/FilterField';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Processo } from '~/types/Processos';

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}



export default function Cases() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProcesso, setCurrentProcesso] = useState<Processo | null>(null);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    numero: '',
    status: '',
  });

  async function fetchProcessos() {
    setLoading(true);
    try {
      const response = await api.get('/processos', {
        params: {
          numero: filters.numero || undefined,
          status: filters.status || undefined,
        },
      });
      setProcessos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar processos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProcessos();
  }, []);

  function handleOpenModal(proc: Processo | null = null) {
    setCurrentProcesso(proc);
    setModalIsOpen(true);
  }

  function handleCloseModal() {
    setModalIsOpen(false);
    setCurrentProcesso(null);
  }

  function handleOpenDeleteModal(proc: Processo) {
    setCurrentProcesso(proc);
    setDeleteModalIsOpen(true);
  }

  function handleCloseDeleteModal() {
    setDeleteModalIsOpen(false);
    setCurrentProcesso(null);
  }

  async function handleSaveProcesso(data: Omit<Processo, 'id' | 'criadoEm'>) {
    try {
      if (currentProcesso) {
        // editar
        await api.put(`/processos/${currentProcesso.id}`, data);
        toast.success('Processo atualizado com sucesso!');
      } else {
        // criar
        await api.post('/processos', data);
        toast.success('Processo criado com sucesso!');
      }
      handleCloseModal();
      fetchProcessos();
    } catch (error) {
      toast.error('Não foi possível salvar o processo.');
    }
  }

  async function handleDeleteProcesso() {
    if (!currentProcesso) return;
    try {
      await api.delete(`/processos/${currentProcesso.id}`);
      toast.success('Processo removido com sucesso!');
      handleCloseDeleteModal();
      fetchProcessos();
    } catch (error) {
      toast.error('Não foi possível remover o processo.');
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters() {
    fetchProcessos();
  }

  function resetFilters() {
    setFilters({ numero: '', status: '' });
    fetchProcessos();
  }

  const columns = [
    { name: 'numero', label: 'Número' },
    { name: 'status', label: 'Status' },
    {
      name: 'criadoEm',
      label: 'Data de Criação',
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <div className="w-full p-4">
      {/* Título + Botão Criar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Casos</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Caso
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <FilterField label="Título / Número">
            <input
              type="text"
              value={filters.numero}
              onChange={(e) => handleFilterChange('numero', e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Filtrar por número"
            />
          </FilterField>

          <FilterField label="Status">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </FilterField>
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded shadow w-full overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={processos}
            onEdit={(_, row) => handleOpenModal(row)}
            onDelete={(_, row) => handleOpenDeleteModal(row)}
          />
        )}
      </div>

      {/* Modal de Criar/Editar (usando CustomModal) */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
  className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg outline-none mx-auto"
      >
        <ProcessModal
          onClose={handleCloseModal}
          onSave={handleSaveProcesso}
          processoData={currentProcesso}
        />
      </Modal>

      {/* Modal de Exclusão (usando CustomModal) */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={handleCloseDeleteModal}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
          <p className="mb-6">
            Tem certeza que deseja excluir o processo nº “{currentProcesso?.numero}”? 
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteProcesso}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 inline-flex items-center gap-1"
            >
              <ExclamationTriangleIcon className="w-5 h-5" />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
