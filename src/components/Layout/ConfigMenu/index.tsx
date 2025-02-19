import { forwardRef, useImperativeHandle, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useRecoilState } from "recoil";
import { Switch } from "~/components/Switch";
import { layoutState } from "~/store/layoutState";

export const ConfigMenu = forwardRef(({ aaa }: any, ref) => {

  const [isOpen, setIsOpen] = useState(false);

  const [layoutConfig, setLayoutConfig] = useRecoilState(layoutState);

  const show = () => {
    setIsOpen(true)
  }

  const hide = () => {
    setIsOpen(false)
  }
  
  const handleChangeLayoutMode = (mode: string) => {
    setLayoutConfig({ layoutMode: mode })
  }

  useImperativeHandle(ref, () => ({
    hide: () => hide(),
    show: () => show(),
  }));

  return (
    <div>
      <div className={`fixed inset-0 bg-[rgba(50,58,70,.55)] bg-opacity-50 transition-opacity z-40 duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={hide} />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center h-[70px] bg-sky-900 px-4 text-white">
          Configurações
          <button className="bg-gray-800 hover:bg-gray-700 rounded-full" onClick={hide}>
            <IoIosClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 text-gray-600">
          <div className="grid gap-2">
            <div>Layout</div>
            <div className="grid gap-1">
              <Switch name="layoutVertical" label="Vertical" value={layoutConfig.layoutMode === "vertical"} onChange={() => handleChangeLayoutMode("vertical")} />
              <Switch name="layoutHorizontal" label="Horizontal" value={layoutConfig.layoutMode === "horizontal"} onChange={() => handleChangeLayoutMode("horizontal")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})
