'use client';
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { getDeviceId } from '@/lib/device';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'multkitsbrasil@gmail.com';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // A. Authenticate
            const loginEmail = isAdminMode ? (ADMIN_EMAIL || '') : email;
            console.log('Attempting login with:', loginEmail);

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: isAdminMode ? adminPassword : password,
            });

            if (authError) {
                console.error('Login error:', authError);
                if (authError.message === 'Invalid login credentials') {
                    throw new Error(`E-mail ou senha incorretos. (Tentando acessar: ${loginEmail})`);
                } else if (authError.message.includes('Email not confirmed')) {
                    throw new Error('Por favor, confirme seu e-mail antes de entrar.');
                } else {
                    throw new Error(authError.message);
                }
            }

            if (!authData.user) {
                throw new Error('Erro ao obter dados do usuário.');
            }

            const current_user_id = authData.user.id;

            // If Admin Mode, redirect to Admin Gate
            if (isAdminMode) {
                router.push('/admin_gate');
                return;
            }

            // B. Check User Status (Normal User)
            const { data: profileData, error: profileError } = await supabase
                .from('users_profile')
                .select('status')
                .eq('id', current_user_id)
                .single();

            if (profileError) {
                throw new Error('Erro ao verificar perfil do usuário.');
            }

            const user_status = profileData?.status;

            if (user_status === 'pending') {
                await supabase.auth.signOut();
                setError('Seu cadastro ainda não foi aprovado pelo administrador.');
                return;
            }

            if (user_status === 'rejected') {
                await supabase.auth.signOut();
                setError('Seu cadastro foi rejeitado. Contate o suporte.');
                return;
            }

            if (user_status === 'approved') {
                // C. Active Session Management (Kick Strategy)
                // We simply upsert the session with the new device ID.
                // This will invalidate any previous session on another device because
                // the 'device_id' in the database will no longer match the other device's ID.

                const deviceId = getDeviceId();
                if (!deviceId) throw new Error('Erro ao identificar dispositivo.');

                // Create or Update Session
                const { error: upsertError } = await supabase
                    .from('active_sessions')
                    .upsert({
                        user_id: current_user_id,
                        device_id: deviceId,
                        last_seen: new Date().toISOString(),
                        is_active: true
                    });

                if (upsertError) {
                    console.error('Session update error:', upsertError);
                    // Optionally block login if strict, or allow but log error.
                    // Let's allow for now but log it.
                }

                router.push('/catalogo');
            } else {
                await supabase.auth.signOut();
                setError('Status da conta desconhecido.');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isAdminMode ? 'Acesso Administrativo' : 'Entrar na sua conta'}
                    </h2>
                    {!isAdminMode && (
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Ou{' '}
                            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                                crie uma nova conta
                            </Link>
                        </p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isAdminMode ? (
                            <div>
                                <label htmlFor="admin-password" className="sr-only">
                                    Senha de Administrador
                                </label>
                                <input
                                    id="admin-password"
                                    name="adminPassword"
                                    type="password"
                                    required
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Senha de Administrador"
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="email-address" className="sr-only">
                                        E-mail
                                    </label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Endereço de e-mail"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Senha
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Senha"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isAdminMode ? 'bg-gray-800 hover:bg-gray-900' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                isAdminMode ? 'Acessar Painel' : 'Entrar'
                            )}
                        </button>
                    </div>
                </form>

                {/* Toggle Admin Mode */}
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => {
                            setIsAdminMode(!isAdminMode);
                            setError(null);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        title={isAdminMode ? "Voltar ao login de usuário" : "Acesso Administrativo"}
                    >
                        {isAdminMode ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
