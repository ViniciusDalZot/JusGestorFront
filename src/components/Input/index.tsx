import { ReactNode } from "react"

interface IProps {
  name: string
  label: string
  floatingLabel?: boolean
  value?: any
  onChange?: (e: any) => void
  placeholder?: string
  suffixAction?: () => void
  suffixIcon?: ReactNode
  type?: string
  error?: string
  required?: boolean
  formLoading?: boolean
}

export const Input = ({ name, label, floatingLabel = false, placeholder, value, onChange, suffixAction, suffixIcon, type = "text", error, required = false, formLoading = false }: IProps) => {
  return (
    floatingLabel ? (
      <div className="relative">
        <input
          type="text"
          id={name}
          className={`block py-2 px-2.5 w-full text-sm text-gray-900 bg-transparent rounded-sm border border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer ${formLoading && "bg-gray-200 animate-pulse"}`}
          placeholder=" "
          onChange={onChange}
        />
        <label
          htmlFor={name}
          className={`${formLoading && "hidden"} absolute flex items-center gap-2 text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-text`}
        >
          <div>
            {label}:
            {required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          {error && (
            <span className="text-[12px] upper text-red-400">({error})</span>
          )}
        </label>
      </div>
    ) : (
      <div className='grid gap-2'>
        <label htmlFor={name} className='text-sm text-slate-600 flex gap-2'>
          <div>
            {label}:
            {required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </div>
          {error && (
            <span className="text-[12px] upper text-red-400">({error})</span>
          )}
        </label>
        <div className='flex border border-gray-200'>
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className="block py-2 px-2.5 w-full text-sm text-gray-900 bg-transparent rounded-sm outline-none"
            value={value}
            onChange={onChange}
          />
          {suffixAction && (
            <div className='flex justify-center items-center px-2.5 border-l border-gray-200 h-full bg-gray-100 cursor-pointer' onClick={suffixAction}>
              {suffixIcon}
            </div>
          )}
        </div>
      </div>
    )
  )
}