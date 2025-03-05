import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '~/services/api';
import { MdOutlineNavigateNext } from "react-icons/md";

interface ApiResponse {
  notificacoesPorPeriodo: Array<{ data: string; quantidade: string }>;
  statusNotificacoes: Array<{ status: string; quantidade: string }>;
  principaisTribunais: Array<{ siglatribunal: string; quantidade: string }>;
  processosRecentes: Array<any>;
}

interface DashboardData {
  totalNotificacoesHoje: number;
  totalPendencias: number;
  movimentacoesRecentes: number;
  principaisTribunais: Array<{ sigla: string; quantidade: number }>;
  statusNotificacoes: Array<{ status: string; quantidade: number }>;
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        totalNotificacoesHoje: 0,
        totalPendencias: 0,
        movimentacoesRecentes: 0,
        principaisTribunais: [],
        statusNotificacoes: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<ApiResponse>('/estatisticas/todas');
                const data = response.data;

                // Notificações do dia
                const today = new Date().toISOString().split('T')[0];
                const notificacoesHoje = data.notificacoesPorPeriodo
                    .filter(item => new Date(item.data).toISOString().split('T')[0] === today)
                    .reduce((acc, item) => acc + parseInt(item.quantidade), 0);

                // Status das notificações
                const pendencias = data.statusNotificacoes
                    .find(item => item.status === 'P')?.quantidade || '0';

                // Processar tribunais
                const tribunais = data.principaisTribunais
                    .map(t => ({
                        sigla: t.siglatribunal,
                        quantidade: parseInt(t.quantidade)
                    }))
                    .sort((a, b) => b.quantidade - a.quantidade)
                    .slice(0, 3);

                setDashboardData({
                    totalNotificacoesHoje: notificacoesHoje,
                    totalPendencias: parseInt(pendencias),
                    movimentacoesRecentes: data.processosRecentes.length,
                    principaisTribunais: tribunais,
                    statusNotificacoes: data.statusNotificacoes.map(item => ({
                        status: item.status,
                        quantidade: parseInt(item.quantidade)
                    }))
                });

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, []);

    const Card = ({ title, children, link }: { title: string; children: React.ReactNode; link?: string }) => (
        <div className="flex flex-col bg-white rounded-lg shadow-md h-48 hover:shadow-lg transition-shadow">
            <h3 className="uppercase text-sm font-semibold text-gray-600 p-4 border-b">{title}</h3>
            <div className="flex flex-col justify-center items-center flex-1 p-4 text-center">
                {children}
            </div>
            {link && (
                <Link to={link} className="text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium 
                    rounded-b-lg flex items-center justify-center gap-1">
                    Ver detalhes <MdOutlineNavigateNext className="w-5 h-5" />
                </Link>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            <Card title="Intimaçõ2es" link="/intimacoes">
                <div className="space-y-2">
                    <p className="text-3xl font-bold text-indigo-600">
                        {dashboardData.totalNotificacoesHoje}
                        <span className="text-sm font-normal block">hoje</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Pendentes: {dashboardData.totalPendencias}
                    </p>
                </div>
            </Card>

            <Card title="Movimentações" link="/movimentacoes">
                <p className="text-3xl font-bold text-indigo-600">
                    {dashboardData.movimentacoesRecentes}
                    <span className="text-sm font-normal block">últimas 24h</span>
                </p>
            </Card>

            <Card title="Principais Tribunais">
                <div className="w-full space-y-2">
                    {dashboardData.principaisTribunais.map((tribunal, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span>{tribunal.sigla}</span>
                            <span className="font-medium">{tribunal.quantidade}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Status Intimações">
                <div className="w-full space-y-2">
                    {dashboardData.statusNotificacoes.map((status, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span>{status.status === 'P' ? 'Pendentes' : 'Concluídas'}</span>
                            <span className="font-medium">{status.quantidade}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Processos Recentes" link="/processos">
                <div className="text-sm space-y-1">
                    <p className="text-gray-600">Novos processos cadastrados</p>
                    <p className="text-indigo-600 font-medium">
                        {dashboardData.movimentacoesRecentes} recentes
                    </p>
                </div>
            </Card>

            <Card title="Próximos Prazos">
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>7 dias</span>
                        <span className="text-red-600">0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>15 dias</span>
                        <span className="text-orange-600">0</span>
                    </div>
                    <div className="flex justify-between">
                        <span>30 dias</span>
                        <span className="text-yellow-600">0</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;