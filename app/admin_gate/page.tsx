'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'multkitsbrasil@gmail.com';

export default function AdminGate() {
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/login');
                    return;
                }

                const isIdMatch = ADMIN_ID && session.user.id === ADMIN_ID;
                const isEmailMatch = ADMIN_EMAIL && session.user.email === ADMIN_EMAIL;

                if (!isIdMatch && !isEmailMatch) {
                    // If neither ID nor Email matches, redirect to login
                    router.push('/login');
                    return;
                }

                router.push('/admin_dashboard');
            } catch (error) {
                console.error('Admin check error:', error);
                router.push('/login');
            }
        };

        checkAdmin();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
}
