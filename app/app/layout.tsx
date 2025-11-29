'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getDeviceId } from '@/lib/device';

export default function InternalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/login');
                    return;
                }

                // 1. Check Profile Status
                const { data: profile, error } = await supabase
                    .from('users_profile')
                    .select('status')
                    .eq('id', session.user.id)
                    .single();

                if (error || !profile) {
                    console.error('Error fetching profile:', error);
                    router.push('/login');
                    return;
                }

                if (profile.status !== 'approved') {
                    router.push('/pendente');
                    return;
                }

                // 2. Check Active Session
                const deviceId = getDeviceId();
                if (!deviceId) {
                    await supabase.auth.signOut();
                    router.push('/login');
                    return;
                }

                const { data: sessionData, error: sessionError } = await supabase
                    .from('active_sessions')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (sessionError || !sessionData) {
                    // If no session found, maybe create one? Or force login.
                    // Let's force login for security.
                    await supabase.auth.signOut();
                    router.push('/login');
                    return;
                }

                if (sessionData.device_id !== deviceId || !sessionData.is_active) {
                    await supabase.auth.signOut();
                    // We could pass a query param to show a message on login page
                    router.push('/login');
                    return;
                }

                // 3. Update Last Seen
                await supabase
                    .from('active_sessions')
                    .update({ last_seen: new Date().toISOString() })
                    .eq('user_id', session.user.id);

                setLoading(false);
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/login');
            }
        };

        checkAuth();

        // Optional: Periodic check
        const interval = setInterval(checkAuth, 60000); // Check every minute
        return () => clearInterval(interval);

    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return <>{children}</>;
}
