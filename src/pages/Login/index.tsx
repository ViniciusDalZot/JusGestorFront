import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiEyeLight } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";
import { Form, Formik } from 'formik';
import { Box, Button, Input } from '~/components';
import { Checkbox } from '~/components/Checkbox';
import logoFull from '~/assets/logos/logo-full.png';
import api from '~/services/api';
import Yup from '~/config/yup';

export interface IFormValues {
    username: string
    password: string
    rememberme: boolean
}

const Login = () => {

    const navigate = useNavigate();

    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const initialValues: IFormValues = {
        username: "",
        password: "",
        rememberme: false
    }

    const handleSubmit = async (values: IFormValues) => {
        try {
            const response: any = await api.post('/auth/login', { username: values.username, password: values.password });
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            setError('Usuário ou senha incorretos');
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    
    const validationSchema = Yup.object({
        username: Yup.string().required(),
        password: Yup.string().required(),
    });

    return (
        <Box className='flex flex-col pt-24 items-center h-full gap-6 bg-[#efefef]'>

            <img src={logoFull} alt="Logo" className='w-32' />

            <Box className='bg-white w-full sm:w-[400px] p-6 rounded-md shadow-md'>

                <Box className='text-lg uppercase text-center pb-6'>Login</Box>

                <Formik validationSchema={validationSchema} validateOnChange={false} initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, handleChange, errors, isSubmitting }) => (
                        <Form className='grid gap-6'>
                            <Input  
                                label='Endereço de e-mail'
                                name='username'
                                placeholder='usuario@dominio.com'
                                value={values.username}
                                onChange={handleChange("username")}
                                error={error ? error : errors.username}
                            />

                            <Input
                                label='Senha'
                                name='password'
                                placeholder='Informe sua senha'
                                type={showPassword ? "text" : "password"}
                                suffixAction={handleShowPassword}
                                suffixIcon={showPassword ? <PiEyeSlash className='w-5 h-5 text-gray-500' /> : <PiEyeLight className='w-5 h-5 text-gray-500' />}
                                value={values.password}
                                onChange={handleChange("password")}
                                error={error ? error : errors.password}
                            />

                            <Checkbox label='Lembrar de mim' name='rememberme' value={values.rememberme} onChange={handleChange("rememberme")} />

                            <Button type='submit' style='formSubmit' isLoading={isSubmitting}>Entrar</Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default Login;
