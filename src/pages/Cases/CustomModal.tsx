import Modal from 'react-modal';

interface CustomModalProps extends Modal.Props {
  title?: string;
  children: React.ReactNode;
}

export function CustomModal({ title, children, ...rest }: CustomModalProps) {
  return (
    <Modal
      overlayClassName="
        fixed inset-0 
        bg-black bg-opacity-40 
        flex items-center justify-center
      "
      className="
        bg-white rounded-lg shadow-lg 
        p-6 
        w-full max-w-lg 
        outline-none 
        mx-auto
      "
      {...rest}
    >
      {children}
    </Modal>
  );
}
