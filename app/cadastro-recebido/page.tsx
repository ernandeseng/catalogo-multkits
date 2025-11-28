import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CadastroRecebidoPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Recebido</h1>
                <p className="text-gray-600 mb-6">
                    Seu cadastro foi enviado e está pendente de aprovação do administrador.
                </p>
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Voltar para Login
                </Link>
            </div>
        </div>
    );
}
