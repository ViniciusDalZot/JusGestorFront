import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '~/services/api';
import { MdOutlineNavigateNext } from "react-icons/md";

const Dashboard = () => {
    const [totals, setTotals] = useState<any>({
        total_notificacoes: 0,
        total_eventos: 0,
        total_compromissos: 0,
    });

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const data = await api.get('/dashboard/totals');
                setTotals(data);
            } catch (error) {
                console.error('Erro ao buscar totais:', error);
            }
        };

        fetchTotals();
    }, []);

    const cards = [
        {
            title: "Intimações",
            content: <p>{totals.total_notificacoes} hoje</p>,
            link: "/intimações"
        },
        {
            title: "Movimentações",
            content: <p>{totals.total_eventos} hoje</p>,
            link: "/movimentacoes"
        },
        {
            title: "Processos",
            content: <p>Cadastre seus processos</p>,
            link: "/processos"
        },
        {
            title: "Agenda",
            content: <p>{totals.total_compromissos} compromissos hoje</p>,
            link: "/compromissos"
        },
        {
            title: "Prazos",
            content: (
                <div>
                    <p>Hoje: 0</p>
                    <p>Próximos 7 dias: 0</p>
                    <p>Próximos 15 dias: 0</p>
                </div>
            ),
            link: null
        },
    ]

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            {cards.map((card, key) => (
                <div key={key} className="flex flex-col bg-white rounded-sm shadow-sm h-36">
                    <div className='uppercase text-md text-slate-700 p-2'>{card.title}:</div>
                    <div className='flex flex-col justify-center items-center flex-1 p-2'>
                        {card.content}
                    </div>
                    {card.link && (
                        <Link to="/intimacoes" className='text-center py-2 rounded-b-sm bg-indigo-500/80 hover:bg-indigo-500/70 text-white flex justify-center items-center'>Ver {card.title} <MdOutlineNavigateNext className='w-5 h-5' /></Link>
                    )}
                </div>
            ))}
        </div>
        /* <div className="dashboard">
            <div className="card">
                <h3>Intimações</h3>
                <p>{totals.total_notificacoes} hoje</p>
                <Link to="/intimacoes">Ver Intimações</Link>
            </div>
            <div className="card">
                <h3>Movimentações</h3>
                <p>{totals.total_eventos} hoje</p>
                <Link to="/movimentacoes">Ver Movimentações</Link>
            </div>
            <div className="card">
                <h3>Processos</h3>
                <p>Cadastre seus processos</p>
                <Link to="/processos">Ver Processos</Link>
            </div>
            <div className="card">
                <h3>Agenda</h3>
                <p>{totals.total_compromissos} compromissos hoje</p>
                <Link to="/compromissos">Ver Agenda</Link>
            </div>
            <div className="card">
                <h3>Prazos</h3>
                <p>Hoje: 0</p>
                <p>Próximos 7 dias: 0</p>
                <p>Próximos 15 dias: 0</p>
            </div>
        </div> */
    );
};

export default Dashboard;
