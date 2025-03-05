import { useEffect, useState } from 'react';
import { DataTable } from '~/components';
import { toDDMMYYYY } from '~/utils/functions';
import api from '~/services/api';

const Customers = () => {
    const [clients, setClients] = useState<any>([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/clientes');
                setClients(response.data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchClients();
    }, []);

    return (
        <DataTable
            columns={
                [
                    {
                        label: "ID",
                        name: "id",
                    },
                    {
                        label: "Nome",
                        name: "nome"
                    },
                    {
                        label: "Contato",
                        name: "telefone"
                    },
                    {
                        label: "Origem",
                        name: "origem"
                    },
                    {
                        label: "CPF/CNPJ",
                        name: "cpfCnpj"
                    },
                    {
                        label: "Inserido em",
                        name: "criadoEm",
                        render: (data) => <div>{toDDMMYYYY(data)}</div>
                    },
                ]
            } 
            data={clients}
        />
    );
};

export default Customers;
