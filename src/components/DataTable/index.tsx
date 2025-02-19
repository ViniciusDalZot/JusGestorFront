import { createArray } from "~/utils/functions";
import { GrEdit, GrTrash, GrFormSearch } from "react-icons/gr";
import { Input } from "../Input";
import { Checkbox } from "../Checkbox";
import { SlEye } from "react-icons/sl";

interface IColumn {
  name: string
  label: string
  textAlign?: "start" | "center" | "end"
  render?: (data: string, row: any) => void
}

interface IDataTable {
  columns: IColumn[]
  onAdd?: () => void
  onEdit?: (data: string, row: any) => void
  onDelete?: (data: string, row: any) => void
  onView?: (data: string, row: any) => void
  data: any
}

export const DataTable = ({ columns, onAdd, onEdit, onDelete, onView, data }: IDataTable) => {

  const currentPage = 1;

  const perPage = 50;

  const enableActionsColumn = onEdit || onDelete || onView

  const onViewEntry = (data: string, row: any) => {
    onView && onView(data, row)
  }
  
  return (
    <div className="rounded-sm bg-white">
      
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
      <div className="overflow-x-auto max-h-[500px]">
        <table className="relative w-full rounded-sm">
          <thead className="bg-white sticky top-0 z-30">
            <tr className="border-b border-gray-100">
              <th></th>
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
            {data.slice(0, perPage).map((entry: any, key: number) => (
              <tr key={key} className="border-b border-gray-100">
                <td className="w-20 text-center">
                  <div className="flex justify-center items-center">
                    <Checkbox name="teste" />
                  </div>
                </td>

                {columns.map((column: IColumn, key: number) => (
                  <td key={key} className={`${column.textAlign ? `text-${column.textAlign}` : "text-start"} p-2 whitespace-nowrap`}>
                    {column.render ? column.render(entry[column.name], entry) : entry[column.name]}
                  </td>
                ))}

                {enableActionsColumn && (
                  <td className="p-2 sticky right-0 bg-white shadow-md z-20">
                    <div className="flex gap-3">
                      {onView && (
                        <button className="p-1.5 border border-teal-100 hover:bg-teal-100 text-teal-300 rounded-sm" onClick={() => onViewEntry(entry["id"], entry)}>
                          <SlEye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button className="p-1.5 border border-indigo-100 hover:bg-indigo-100 text-indigo-300 rounded-sm">
                          <GrEdit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button className="p-1.5 border border-red-100 hover:bg-red-100 text-red-300 rounded-sm">
                          <GrTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-4">
        <div className="text-gray-500">Exibindo 1 a 5 de {data.length} registros</div>
        <div className="flex gap-2">
          {createArray(data.length / perPage).map((i) => (
            <div key={i} className="flex justify-center items-center border h-8 w-8 rounded-sm">{i}</div>
          ))}
        </div>
      </div>
    </div>
  )
}