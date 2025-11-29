'use client';

import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const router = useRouter();

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

    return (
        <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
        </button>
    );
}
