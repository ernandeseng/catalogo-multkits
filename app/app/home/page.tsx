import db from "@/lib/db";
import CatalogClient from "../../catalogo/CatalogClient";
import LogoutButton from "./LogoutButton";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const categories = await db.getCategories();
    const products = await db.getProducts();

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Catálogo Digital</h1>
                    <LogoutButton />
                </div>
            </div>
            <CatalogClient initialCategories={categories} initialProducts={products} />
        </main>
    );
}
