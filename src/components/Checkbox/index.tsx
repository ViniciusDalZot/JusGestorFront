import { Box } from "../Box"

interface ICheckbox {
  name: string
  label?: string
  value?: boolean
  onChange?: (e: any) => void
}

export const Checkbox = ({ name, label, value = false, onChange }: ICheckbox) => {
  return (
    <label htmlFor={name} className="flex justify-start items-center gap-2 text-sm">
      <input checked={value} type="checkbox" id={name} className="hidden peer" onChange={onChange}/>
      <div className="checkmark w-4 h-4 border border-slate-300 rounded-sm cursor-pointer peer-checked:bg-sky-500"></div>
      {label && (
        <div className='cursor-pointer'>{label}</div>
      )}
    </label>
  )
}