// ProcessModal.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IProcesso {
  id: number;
  numero: string;
  valor_causa: number | null;
  tipo_processo: string | null;
  status: string;
  fase_processo: string | null;
  data_distribuicao: string | null;
  data_ultima_movimentacao: string | null;
  origem_processo: string | null;
  responsavel_processo: string | null;
  observacoes_internas: string | null;
  criadoEm: string;
}

interface ProcessModalProps {
  onClose: () => void;
  onSave: (data: Omit<IProcesso, 'id' | 'criadoEm'>) => void;
  processoData: IProcesso | null;
}

type FormData = {
  numero: string;
  status: string;
  observacoes_internas?: string;
};

const ProcessModal = ({ onClose, onSave, processoData }: ProcessModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      numero: '',
      status: 'Em andamento',
      observacoes_internas: '',
    },
  });

  const [activeTab, setActiveTab] = useState<number>(0); // 0 = aba 1, 1 = aba 2

  useEffect(() => {
    if (processoData) {
      // Se for edição, carrega valores
      reset({
        numero: processoData.numero ?? '',
        status: processoData.status ?? 'Em andamento',
        observacoes_internas: processoData.observacoes_internas ?? '',
      });
    } else {
      // Criação
      reset({
        numero: '',
        status: 'Em andamento',
        observacoes_internas: '',
      });
    }
  }, [processoData, reset]);

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      valor_causa: null,
      tipo_processo: null,
      fase_processo: null,
      data_distribuicao: null,
      data_ultima_movimentacao: null,
      origem_processo: null,
      responsavel_processo: null,
    });
  };

  return (
    <div className="w-full">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {processoData ? 'Editar Processo' : 'Novo Processo'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Navegação de Abas */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 0 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dados Básicos
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 1 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Observações
          </button>
        </nav>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {activeTab === 0 && (
          <div>
            {/* ABA 1: Dados Básicos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded ${
                  errors.numero ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('numero', {
                  required: 'O número do processo é obrigatório',
                })}
              />
              {errors.numero && (
                <p className="text-red-500 text-sm mt-1">{errors.numero.message}</p>
              )}
            </div>

            {/* Exemplo: status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 border rounded border-gray-300"
                {...register('status')}
              >
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            {/* ABA 2: Observações Internas */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Internas
              </label>
              <textarea
                className="w-full p-2 border rounded border-gray-300"
                rows={4}
                {...register('observacoes_internas')}
              />
            </div>
          </div>
        )}

        {/* Botões (fora das abas, pois são "globais" ao form) */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessModal;
