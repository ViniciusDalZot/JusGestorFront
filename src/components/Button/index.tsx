import { ReactNode } from "react";
import { ImHammer2 } from "react-icons/im";

interface IButton {
  isLoading?: boolean
  children: ReactNode
  type?: "button" | "submit"  
  style: "formSubmit" | "formCancel"
  onClick?: () => void
}

export const Button = ({ isLoading = false, children, type = "button", style, onClick }: IButton) => {

  const styles: any = {
    formSubmit: "bg-blue-400 hover:bg-blue-500",
    formCancel: "bg-slate-500 hover:bg-slate-600",
  }

  return (
    <button type={type} disabled={isLoading} className={`relative text-white py-2 px-6 rounded-sm ${styles[style]}`} onClick={onClick}>
      {(isLoading && type === "submit") ? (
        <div>
          <div className='absolute top-0 start-2 h-full flex items-center'>
          </div>

          <div>
              Aguarde...
          </div>

          <div className='absolute top-0 end-2.5 h-full flex items-center'>
            <ImHammer2 className="w-6 h-6 animate-hammer" />
          </div>
        </div>
      ) : (
        children
      )}
  </button>
  )
}