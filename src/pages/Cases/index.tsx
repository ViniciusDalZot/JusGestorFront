import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import api from '~/services/api';
import { DataTable } from '~/components';
import { Spinner } from '~/components/Spinner';
import ProcessModal from './ProcessModal';
import { toDDMMYYYY } from '~/utils/functions';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';

Modal.setAppElement('#root');

const FilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 flex-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    status: '',
  });

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cases', {
        params: {
          title: filters.title || undefined,
          status: filters.status || undefined,
        },
      });
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Erro ao carregar os casos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenModal = (caseItem: Case | null = null) => {
    setCurrentCase(caseItem);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCurrentCase(null);
  };

  const handleOpenDeleteModal = (caseItem: Case) => {
    setCurrentCase(caseItem);
    setDeleteModalIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setCurrentCase(null);
  };

  const handleSaveCase = async (caseData: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (currentCase) {
        // Update existing case
        await api.put(`/cases/${currentCase.id}`, caseData);
        toast.success('Caso atualizado com sucesso!');
      } else {
        // Create new case
        await api.post('/cases', caseData);
        toast.success('Caso criado com sucesso!');
      }
      handleCloseModal();
      fetchCases();
    } catch (error) {
      console.error('Error saving case:', error);
      toast.error('Erro ao salvar o caso. Tente novamente.');
    }
  };

  const handleDeleteCase = async () => {
    if (!currentCase) return;
    
    try {
      await api.delete(`/cases/${currentCase.id}`);
      toast.success('Caso removido com sucesso!');
      handleCloseDeleteModal();
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      toast.error('Erro ao remover o caso. Tente novamente.');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    fetchCases();
  };

  const resetFilters = () => {
    setFilters({
      title: '',
      status: '',
    });
    fetchCases();
  };

  const columns = [
    {
      header: 'Título',
      accessor: 'title',
    },
    {
      header: 'Descrição',
      accessor: 'description',
    },
    {
      header: 'Status',
      accessor: 'status',
    },
    {
      header: 'Data de Criação',
      accessor: 'createdAt',
      cell: (row: Case) => toDDMMYYYY(row.createdAt),
    },
    {
      header: 'Ações',
      cell: (row: Case) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
          <button
            onClick={() => handleOpenDeleteModal(row)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Casos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Novo Caso
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="flex gap-4 mb-4">
          <FilterField label="Título">
            <input
              type="text"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Filtrar por título"
            />
          </FilterField>
          <FilterField label="Status">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <DataTable
          data={cases}
          columns={columns}
          emptyMessage="Nenhum caso encontrado"
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="bg-white rounded-lg p-6 max-w-2xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex"
      >
        <ProcessModal
          onClose={handleCloseModal}
          onSave={handleSaveCase}
          caseData={currentCase}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={handleCloseDeleteModal}
        className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex"
      >
        <div>
          <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
          <p className="mb-6">
            Tem certeza que deseja excluir o caso "{currentCase?.title}"? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteCase}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cases;