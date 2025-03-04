import { GrEdit, GrTrash, GrFormSearch } from "react-icons/gr";
import { Input } from "../Input";
import { Checkbox } from "../Checkbox";
import { SlEye } from "react-icons/sl";
import { useEffect, useState } from 'react';

interface IColumn {
  name: string
  label: string
  textAlign?: "start" | "center" | "end"
  render?: (data: any, row: any) => React.ReactNode
}

interface IPaginationConfig {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

interface IDataTable {
  columns: IColumn[]
  onAdd?: () => void
  onEdit?: (data: any, row: any) => void
  onDelete?: (data: any, row: any) => void
  onView?: (data: any, row: any) => void
  data: any[]
  loading?: boolean
  pagination?: boolean
  paginationConfig?: IPaginationConfig
}

export const DataTable = ({ 
  columns, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView, 
  data, 
  loading,
  pagination = false,
  paginationConfig 
}: IDataTable) => {

  const [localPage, setLocalPage] = useState(1)
  const enableActionsColumn = onEdit || onDelete || onView

  useEffect(() => {
    if (paginationConfig) {
      setLocalPage(paginationConfig.currentPage)
    }
  }, [paginationConfig?.currentPage])

  const handlePageChange = (newPage: number) => {
    if (paginationConfig) {
      paginationConfig.onPageChange(newPage)
      setLocalPage(newPage)
    }
  }

  const renderPagination = () => {
    if (!pagination || !paginationConfig) return null

    const totalPages = Math.ceil(paginationConfig.totalItems / paginationConfig.pageSize)
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, localPage - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 rounded-sm border ${
            i === localPage 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-200'
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <div className="text-gray-500">
          Exibindo {(localPage - 1) * paginationConfig.pageSize + 1} a{' '}
          {Math.min(localPage * paginationConfig.pageSize, paginationConfig.totalItems)} de{' '}
          {paginationConfig.totalItems} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(localPage - 1)}
            disabled={localPage === 1}
            className="h-8 w-8 rounded-sm border bg-white border-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(localPage + 1)}
            disabled={localPage === totalPages}
            className="h-8 w-8 rounded-sm border bg-white border-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-sm bg-white flex flex-col min-h-[600px]">
      <div className="flex justify-between p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <Input floatingLabel name="name" label="Nome" />
          <Input floatingLabel name="email" label="E-mail" />
          <Input floatingLabel name="department" label="Departamento" />

          <button type="button" className="bg-sky-500 px-1.5 rounded-sm text-white">
            <GrFormSearch className="w-6 h-6" />
          </button>
        </div>
        {onAdd && (
          <button
            type="button"
            className="bg-sky-500 text-white px-4 rounded-sm"
            onClick={onAdd}
          >
            Adicionar +
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
      <div className="overflow-auto h-full">
        <table className="w-full rounded-sm">
            <thead className="bg-white sticky top-0 z-30">
              <tr className="border-b border-gray-100">
                <th className="w-20"></th>
                {columns.map((column: IColumn, key: number) => (
                  <th key={key} className="px-2 py-4 text-start text-slate-500 whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
                {enableActionsColumn && (
                  <th className="px-2 py-4 text-start text-slate-500 sticky right-0 bg-white rounded-tr-md shadow-md w-24">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="text-center p-4">
                    Carregando...
                  </td>
                </tr>
              ) : (
                <>
                  {data.map((entry: any, key: number) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="w-20 text-center">
                        <div className="flex justify-center items-center">
                          <Checkbox name="teste" />
                        </div>
                      </td>

                      {columns.map((column: IColumn, key: number) => (
                        <td 
                          key={key} 
                          className={`${column.textAlign ? `text-${column.textAlign}` : "text-start"} p-2 whitespace-nowrap`}
                        >
                          {column.render ? column.render(entry[column.name], entry) : entry[column.name]}
                        </td>
                      ))}

                      {enableActionsColumn && (
                        <td className="p-2 sticky right-0 bg-white shadow-md z-20">
                          <div className="flex gap-3">
                            {onView && (
                              <button 
                                className="p-1.5 border border-teal-100 hover:bg-teal-100 text-teal-300 rounded-sm" 
                                onClick={() => onView(entry["id"], entry)}
                              >
                                <SlEye className="h-4 w-4" />
                              </button>
                            )}
                            {onEdit && (
                              <button 
                                className="p-1.5 border border-indigo-100 hover:bg-indigo-100 text-indigo-300 rounded-sm"
                                onClick={() => onEdit(entry["id"], entry)}
                              >
                                <GrEdit className="h-4 w-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button 
                                className="p-1.5 border border-red-100 hover:bg-red-100 text-red-300 rounded-sm"
                                onClick={() => onDelete(entry["id"], entry)}
                              >
                                <GrTrash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                  {/* Linhas vazias para manter altura fixa */}
                  {!loading && data.length < 10 && (
                    Array.from({ length: 10 - data.length }).map((_, index) => (
                      <tr 
                        key={`empty-${index}`} 
                        className="border-b border-gray-100 h-[45px]"
                      >
                        <td colSpan={columns.length + 2}>&nbsp;</td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação fixa na base */}
        <div className="mt-auto">
          {pagination && renderPagination()}
        </div>
      </div>
    </div>
  )
}