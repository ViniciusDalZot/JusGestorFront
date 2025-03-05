import { PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface IColumn {
  name: string;
  label: string;
  textAlign?: 'start' | 'center' | 'end';
  render?: (data: any, row: any) => React.ReactNode;
}

interface IPaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

interface IDataTableProps {
  columns: IColumn[];
  data: any[];
  loading?: boolean;

  // Se quiser botões de ação
  onAdd?: () => void;
  onEdit?: (id: number, row: any) => void;
  onDelete?: (id: number, row: any) => void;
  onView?: (id: number, row: any) => void;

  // Paginação
  pagination?: boolean;
  paginationConfig?: IPaginationConfig;
}

export const DataTable = ({
  columns,
  data,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  pagination = false,
  paginationConfig,
}: IDataTableProps) => {
  const [localPage, setLocalPage] = useState(1);

  // Se qualquer uma dessas props existir, habilita a coluna "Ações"
  const enableActionsColumn = onEdit || onDelete || onView;

  useEffect(() => {
    if (paginationConfig) {
      setLocalPage(paginationConfig.currentPage);
    }
  }, [paginationConfig?.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (paginationConfig) {
      paginationConfig.onPageChange(newPage);
      setLocalPage(newPage);
    }
  };

  // ========== PAGINAÇÃO ==========
  const renderPagination = () => {
    if (!pagination || !paginationConfig) return null;

    const { currentPage, pageSize, totalItems } = paginationConfig;
    const totalPages = Math.ceil(totalItems / pageSize);

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, localPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 rounded-sm border mx-0.5 transition
            ${
              i === localPage
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white border-gray-200 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className="flex justify-between items-center p-4 border-t border-gray-100 text-sm text-gray-500">
        <div>
          Exibindo {startItem} a {endItem} de {totalItems} registros
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(localPage - 1)}
            disabled={localPage === 1}
            className="h-8 w-8 rounded-sm border bg-white border-gray-200 disabled:opacity-50 mr-1 hover:bg-gray-100"
          >
            &lt;
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(localPage + 1)}
            disabled={localPage === totalPages}
            className="h-8 w-8 rounded-sm border bg-white border-gray-200 disabled:opacity-50 ml-1 hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg flex flex-col bg-white min-h-[600px]">
      {/* Header da tabela (exemplo de campo de busca e botão 'Adicionar') */}
      <div className="flex justify-between p-4 border-b border-gray-200">
        {/* Exemplo de busca */}
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="border border-gray-300 rounded-sm px-4 py-2 pr-8 focus:outline-none"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute top-2 right-2" />
          </div>
        </div>
        {onAdd && (
          <button
            type="button"
            className="bg-sky-500 text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-sky-600"
            onClick={onAdd}
          >
            Adicionar
          </button>
        )}
      </div>

      {/* Corpo da tabela */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto h-full">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700 sticky top-0 z-30">
              <tr className="border-b border-gray-100">
                {columns.map((column, i) => (
                  <th
                    key={i}
                    className={`px-3 py-3 text-${column.textAlign ?? 'start'} font-medium`}
                  >
                    {column.label}
                  </th>
                ))}
                {enableActionsColumn && (
                  <th className="px-3 py-3 text-center font-medium w-28">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableActionsColumn ? 1 : 0)}
                    className="text-center p-4 text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((entry, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`border-b border-gray-100 hover:bg-gray-50 
                      `}
                    >
                      {columns.map((column, colIndex) => {
                        const cellValue = entry[column.name];
                        return (
                          <td
                            key={`${rowIndex}-${colIndex}`}
                            className={`p-3 whitespace-nowrap text-${column.textAlign ?? 'start'}`}
                          >
                            {column.render
                              ? column.render(cellValue, entry)
                              : cellValue}
                          </td>
                        );
                      })}

                      {enableActionsColumn && (
                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            {onView && (
                              <button
                                className="p-1.5 text-teal-600 hover:text-teal-800"
                                onClick={() => onView(entry.id, entry)}
                                title="Visualizar"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                className="p-1.5 text-blue-600 hover:text-blue-800"
                                onClick={() => onEdit(entry.id, entry)}
                                title="Editar"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className="p-1.5 text-red-600 hover:text-red-800"
                                onClick={() => onDelete(entry.id, entry)}
                                title="Excluir"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* Se data estiver vazio, exiba mensagem */}
                  {data.length === 0 && (
                    <tr>
                      <td
                        colSpan={columns.length + (enableActionsColumn ? 1 : 0)}
                        className="text-center py-6 text-gray-500"
                      >
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* Paginação no rodapé */}
        {pagination && renderPagination()}
      </div>
    </div>
  );
};
