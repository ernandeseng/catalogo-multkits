'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { Loader2, Check, X, LogOut, Package, Eye } from 'lucide-react';

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
const ADMIN_EMAIL = 'multkitsbrasil@gmail.com';

type UserProfile = {
    id: string;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    document?: string;
    phone?: string;
};

export default function AdminDashboard() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('users_profile')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const isIdMatch = session && ADMIN_ID && session.user.id === ADMIN_ID;
            const isEmailMatch = session && ADMIN_EMAIL && session.user.email === ADMIN_EMAIL;

            if (!session || (!isIdMatch && !isEmailMatch)) {
                router.push('/login');
                return;
            }
            fetchUsers();
        };
        checkAdmin();
    }, [router]);

    const handleStatusChange = async (userId: string, newStatus: 'approved' | 'rejected') => {
        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('users_profile')
                .update({ status: newStatus })
                .eq('id', userId);

            if (error) throw error;

            await fetchUsers();
            alert(newStatus === 'approved' ? 'Usuário aprovado com sucesso!' : 'Usuário rejeitado.');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status do usuário.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase
                    .from('active_sessions')
                    .update({ is_active: false })
                    .eq('user_id', session.user.id);
            }
        } catch (error) {
            console.error('Error clearing session:', error);
        }
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.open('/catalogo', '_blank')}
                            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Loja
                        </button>
                        <button
                            onClick={() => router.push('/admin')}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Gerenciar Catálogo
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Usuários Pendentes</h2>
                    </div>

                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum usuário pendente no momento.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.document || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'approved')}
                                                        disabled={actionLoading === user.id}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                                    >
                                                        {actionLoading === user.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                                                        Aprovar
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'rejected')}
                                                        disabled={actionLoading === user.id}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                    >
                                                        {actionLoading === user.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3 mr-1" />}
                                                        Rejeitar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
