import { useState, useEffect, useRef } from 'react';
import { Box, Calendar } from '~/components';
import api from '~/services/api';
import Add from './modals/add';

const Schedules = () => {
    const [compromissos, setCompromissos] = useState<any>([]);

    const addModalRef = useRef<any>(null)

    const fetchCompromissos = async () => {
        try {
            const response: any = await api.get('/compromissos');

            const formatedData = response.data.map(event => ({
                id: event.id,
                title: event.titulo,
                start: event.data_inicio,
                category: "none"
            }));

            setCompromissos(formatedData);
        } catch (error) {
            console.error('Erro ao buscar compromissos:', error);
        }
    };

    useEffect(() => {
        fetchCompromissos();
    }, []);

    return (
        <Box className='grid grid-cols-12 gap-4'>
            <Box className='col-span-2 bg-white p-4 rounded-sm'></Box>

            <Box className='col-span-10 bg-white p-4 rounded-sm'>
                <Calendar events={compromissos} />

                <Add ref={addModalRef} />
            </Box>
        </Box>
    );
};

export default Schedules;

