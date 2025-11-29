'use client';

import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function PendentePage() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center">
                <Clock className="h-16 w-16 text-yellow-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Pendente de Aprovação</h1>
                <p className="text-gray-600 mb-6">
                    Seu cadastro está pendente. Aguarde aprovação do administrador.
                </p>
                <button
                    onClick={handleLogout}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                >
                    Sair
                </button>
            </div>
        </div>
    );
}
