import { Form, Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { MdBalance } from "react-icons/md";
import { Box, Button, Input, Modal } from "~/components";
import { toDDMMYYYY } from "~/utils/functions";
import ReactHtmlParser from 'react-html-parser'
import { Link } from "react-router-dom";

interface ShowProps {
  onClose?: () => void;
}

const Show = forwardRef(({ onClose }: ShowProps, ref) => {

  const [isOpen, setIsOpen] = useState(false);

  const [data, setData] = useState<any>({})

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  useImperativeHandle(ref, () => ({
    hide: () => handleClose(),
    show: (data: any) => {
      setData(data)
      setIsOpen(true)
    },
  }));

  return (
    <Modal
      title={<Box className='flex gap-4 items-center'><MdBalance className='w-5 h-5' /> Detalhes da intimação</Box>}
      isOpen={isOpen}
      onClose={handleClose}
    >
      {data.id ? (
        <div className="grid gap-4">
          <div className="flex gap-2">
            <div className="font-semibold">
              Data: 
            </div>
            {toDDMMYYYY(data.data_disponibilizacao)}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">
              Processo: 
            </div>
            {data.numero_processo}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">
              Tribunal: 
            </div>
            {data.siglatribunal}
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">
              Orgão: 
            </div>
            {data.nomeorgao}
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              Destinatários: 
            </div>
            <ul className="list-disc pl-8">
              {data.destinatarios?.map((item: any, key: number) => (
                item && (
                  <li key={key}>
                    {item?.nome}
                  </li>
                )
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              Advogados destinatários: 
            </div>
            <ul className="list-disc pl-8">
              {data.destinatario_advogados?.map((item: any, key: number) => (
                item && (
                  <li key={key}>
                    {item?.nome}
                  </li>
                )
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              Texto: 
            </div>
            {ReactHtmlParser(data.texto)}
          </div>
          <Link to={data.link} target="_blank" className="text-sky-500">
            Link para o documento
          </Link>
        </div>
      ) : "Aguarde..."}
    </Modal>
  );
});

export default Show;