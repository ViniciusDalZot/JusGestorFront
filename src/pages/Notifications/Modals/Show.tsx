import { forwardRef, useImperativeHandle, useState, useMemo } from "react";
import { IoCalendarOutline, IoDocumentTextOutline, IoLinkOutline } from "react-icons/io5";
import { MdBalance, MdPerson, MdGavel, MdOutlineAccountBalance } from "react-icons/md";
import { Box, Button, Modal } from "~/components";
import { toDDMMYYYY } from "~/utils/functions";
import parse from 'html-react-parser';
import { Link } from "react-router-dom";

interface ShowProps {
  onClose?: () => void;
}

interface NotificationData {
  id?: string;
  data_disponibilizacao?: string;
  numeroprocessocommascara?: string;
  numero_processo?: string;
  siglatribunal?: string;
  nomeorgao?: string;
  destinatarios?: Array<{ nome?: string }>;
  destinatario_advogados?: Array<{ nome?: string }>;
  texto?: string;
  link?: string;
  lida?: boolean;
}

const Show = forwardRef(({ onClose }: ShowProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NotificationData>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  useImperativeHandle(ref, () => ({
    hide: handleClose,
    show: async (data: NotificationData) => {
      try {
        setIsLoading(true);
        setData(data);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
  }));

  const InfoItem = useMemo(() => 
    ({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: React.ReactNode, className?: string }) => (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="text-gray-500 mt-1">{icon}</div>
        <div className="flex-1">
          <div className="font-semibold text-gray-700 mb-1">{label}</div>
          <div className="text-gray-900">{value || 'N/A'}</div>
        </div>
      </div>
    ), []);

  const parsedContent = useMemo(() => {
    try {
      return data.texto ? parse(data.texto) : null;
    } catch (error) {
      console.error('Erro ao parsear conteúdo HTML:', error);
      return <div className="text-red-500">Erro ao carregar conteúdo</div>;
    }
  }, [data.texto]);

  return (
    <Modal
      title={
        <Box className="flex gap-3 items-center text-gray-800">
          <MdBalance className="w-6 h-6 text-blue-600" /> 
          <span className="text-lg font-medium">Detalhes da Intimação</span>
        </Box>
      }
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      ariaLabel="Modal de detalhes da intimação"
    >
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse text-gray-500">Carregando informações...</div>
        </div>
      ) : data.id ? (
        <div className="grid gap-4 p-1">
          {/* Seção principal */}
          <div className="space-y-6">
            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem 
                icon={<IoCalendarOutline className="w-5 h-5" />} 
                label="Data de Disponibilização" 
                value={toDDMMYYYY(data.data_disponibilizacao)}
              />
              <InfoItem 
                icon={<IoDocumentTextOutline className="w-5 h-5" />} 
                label="Número do Processo" 
                value={data.numeroprocessocommascara || data.numero_processo}
              />
              <InfoItem 
                icon={<MdOutlineAccountBalance className="w-5 h-5" />} 
                label="Tribunal" 
                value={data.siglatribunal}
              />
              <InfoItem 
                icon={<MdGavel className="w-5 h-5" />} 
                label="Órgão" 
                value={data.nomeorgao}
              />
            </div>

            {/* Destinatários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.destinatarios?.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MdPerson className="w-5 h-5 text-blue-600" />
                    Destinatários
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {data.destinatarios.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item?.nome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.destinatario_advogados?.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MdPerson className="w-5 h-5 text-blue-600" />
                    Advogados
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {data.destinatario_advogados.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item?.nome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Texto da Intimação */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <IoDocumentTextOutline className="w-5 h-5 text-blue-600" />
                Texto da Intimação
              </h3>
              <div className="prose max-w-none bg-white p-4 rounded-md max-h-96 overflow-auto">
                {parsedContent}
              </div>
            </div>

            {/* Link do documento */}
            {data.link && (
              <div className="mt-4 text-center md:text-left">
                <Link 
                  to={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <IoLinkOutline className="w-5 h-5" />
                  Documento Original
                </Link>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              onClick={handleClose}
              variant="secondary"
              className="min-w-[120px]"
            >
              Fechar
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          Nenhuma informação disponível
        </div>
      )}
    </Modal>
  );
});

export default Show;