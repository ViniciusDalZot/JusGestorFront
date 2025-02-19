import { Form, Formik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FaPerson, FaRegAddressCard, FaBriefcaseMedical, FaHospitalUser } from "react-icons/fa6"
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoCalendarOutline } from "react-icons/io5";
import { Box, Button, Input, Modal } from "~/components";
import Yup from "~/config/yup";

interface AddProps {
  onClose?: () => void;
}
export interface IFormValues {
  title: string,
  description: string,
  initDate: string,
  endDate: string,
  notificationDate: string,
  status: string,
  eventType: string,
  customer: string,
  case: string,
  obs: string,
}

const Add = forwardRef(({ onClose }: AddProps, ref) => {

  const [isOpen, setIsOpen] = useState(false);

  const initialValues: IFormValues = {
    title: "",
    description: "",
    initDate: "",
    endDate: "",
    notificationDate: "",
    status: "",
    eventType: "",
    customer: "",
    case: "",
    obs: "",
  }

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  useImperativeHandle(ref, () => ({
    hide: () => handleClose(),
    show: () => setIsOpen(true),
  }));

  const handleSubmit = async (values: IFormValues) => {
    console.log(values)
    try {

    } catch (error) {

    }
  } 

  const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string().required(),
    initDate: Yup.string().required(),
    endDate: Yup.string().required(),
    notificationDate: Yup.string().required(),
    status: Yup.string().required(),
    eventType: Yup.string().required(),
    customer: Yup.string().required(),
    case: Yup.string().required(),
    obs: Yup.string(),
  });

  return (
    <Formik validationSchema={validationSchema} validateOnChange={false} enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, errors, isSubmitting }) => (
        <Form className='grid gap-6'>
          <Modal
            title={<Box className='flex gap-4 items-center'><IoCalendarOutline className='w-5 h-5' /> Adicionar compromisso</Box>}
            isOpen={isOpen}
            onClose={handleClose}
            footer={
              <Box className="flex justify-end gap-2">
                <Button style="formCancel" isLoading={isSubmitting} onClick={handleClose}>Cancelar</Button>
                <Button type="submit" style="formSubmit" isLoading={isSubmitting} onClick={() => console.log(errors)}>Salvar</Button>
              </Box>
            }
          >
            <Box className="grid gap-2">

              <Box className="grid grid-cols-2 gap-2">
                <Input  
                  label='Título'
                  name='title'
                  floatingLabel
                  formLoading={false}
                  value={values.title}
                  onChange={handleChange("title")}
                  error={errors.title}
                  required
                />
                <Input  
                  label='Descrição'
                  name='description'
                  floatingLabel
                  formLoading={false}
                  value={values.description}
                  onChange={handleChange("description")}
                  error={errors.description}
                  required
                />
              </Box>

              <Box className="grid grid-cols-3 gap-2">
                <Input  
                  label='Data de início'
                  name='initDate'
                  floatingLabel
                  formLoading={false}
                  value={values.initDate}
                  onChange={handleChange("initDate")}
                  error={errors.initDate}
                  required
                />
                <Input  
                  label='Data de fim'
                  name='endDate'
                  floatingLabel
                  formLoading={false}
                  value={values.endDate}
                  onChange={handleChange("endDate")}
                  error={errors.endDate}
                  required
                />
                <Input  
                  label='Notificação'
                  name='notificationDate'
                  floatingLabel
                  formLoading={false}
                  value={values.notificationDate}
                  onChange={handleChange("notificationDate")}
                  error={errors.notificationDate}
                  required
                />
              </Box>

              <Box className="grid grid-cols-4 gap-2">
                <Input  
                  label='Status'
                  name='status'
                  floatingLabel
                  formLoading={false}
                  value={values.status}
                  onChange={handleChange("status")}
                  error={errors.status}
                  required
                />
                <Input  
                  label='Tipo de evento'
                  name='eventType'
                  floatingLabel
                  formLoading={false}
                  value={values.eventType}
                  onChange={handleChange("eventType")}
                  error={errors.eventType}
                  required
                />
                <Input  
                  label='Cliente'
                  name='customer'
                  floatingLabel
                  formLoading={false}
                  value={values.customer}
                  onChange={handleChange("customer")}
                  error={errors.customer}
                  required
                />
                <Input  
                  label='Processo'
                  name='case'
                  floatingLabel
                  formLoading={false}
                  value={values.case}
                  onChange={handleChange("case")}
                  error={errors.case}
                  required
                />
              </Box>

              <Input  
                label='Observações'
                name='obs'
                floatingLabel
                formLoading={false}
                value={values.obs}
                onChange={handleChange("obs")}
                error={errors.obs}
              />
            </Box>
          </Modal>
        </Form>
      )}
    </Formik>
  );
});

export default Add;