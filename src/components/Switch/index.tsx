interface ISwitch {
  label?: string
  name: string
  value: boolean
  onChange?: () => void
}

export const Switch = ({ label, name, value, onChange }: ISwitch) => {
  return (
    <label className="relative inline-flex items-center gap-2 cursor-pointer" htmlFor={name}>
      <input type="checkbox" className="sr-only peer" checked={value} id={name} onChange={onChange} />
      <div
        className="group peer bg-white rounded-full duration-300 w-7 h-3.5 ring-1 ring-gray-300 after:duration-300 after:bg-gray-300 peer-checked:after:bg-white peer-checked:ring-sky-500 peer-checked:bg-sky-500 after:rounded-full after:absolute after:h-2.5 after:w-2.5 after:top-[7px] after:left-0.5 after:flex after:justify-center after:items-center peer-checked:after:translate-x-3.5 peer-hover:after:scale-95"
      ></div>
      {label && (
        <div>{label}</div>
      )}
    </label>
  )
}