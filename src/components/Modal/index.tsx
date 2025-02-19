import { ReactNode } from "react";

interface IModal {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}

export const Modal = ({ isOpen, onClose, title, children, footer, width = "w-[1000px]" }: IModal) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative ${width} bg-white rounded-sm shadow-lg p-4 grid gap-4`} style={{ "maxHeight": "calc(100% - 10rem)" }}>

        <div className="flex items-center justify-between">
          <h2 className="text-lg text-gray-600">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close Modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-auto">{children}</div>

        <div>{footer}</div>
      </div>
    </div>
  );
};