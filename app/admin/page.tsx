'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, supabase, Product, Category } from '@/lib/db';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ArrowLeft,
    Save,
    X,
    Loader2,
    Image as ImageIcon,
    LayoutGrid,
    Package,
    Eye
} from 'lucide-react';

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
const ADMIN_EMAIL = 'multkitsbrasil@gmail.com';

export default function AdminPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

    // Data states
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // UI states
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
    const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Auth check and initial fetch
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            const isIdMatch = session && ADMIN_ID && session.user.id === ADMIN_ID;
            const isEmailMatch = session && ADMIN_EMAIL && session.user.email === ADMIN_EMAIL;

            if (!session || (!isIdMatch && !isEmailMatch)) {
                router.push('/login');
                return;
            }

            await fetchData();
            setIsLoading(false);
        };
        init();
    }, [router]);

    const fetchData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                db.getProducts(),
                db.getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Erro ao carregar dados.');
        }
    };

    // Product Handlers
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    const handleNewProduct = () => {
        setCurrentProduct({
            name: '',
            description: '',
            price: 0,
            category_id: categories[0]?.id,
            image_path: '',
            stock: 0,
            corCodigo: ''
        });
        setIsEditing(true);
    };

    const handleSaveProduct = async () => {
        if (!currentProduct.name || !currentProduct.price || !currentProduct.category_id) {
            alert('Preencha os campos obrigatórios (Nome, Preço, Categoria).');
            return;
        }

        setIsSaving(true);
        try {
            if (currentProduct.id) {
                // Update
                await db.updateProduct(currentProduct.id, currentProduct);
            } else {
                // Create
                await db.createProduct({
                    name: currentProduct.name!,
                    description: currentProduct.description || '',
                    price: Number(currentProduct.price),
                    category_id: Number(currentProduct.category_id),
                    image_path: currentProduct.image_path || '',
                    stock: Number(currentProduct.stock) || 0,
                    corCodigo: currentProduct.corCodigo,
                    variations: currentProduct.variations
                });
            }
            await fetchData();
            setIsEditing(false);
            setCurrentProduct({});
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            await db.deleteProduct(id);
            await fetchData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erro ao excluir produto.');
        }
    };

    // Category Handlers
    const handleSaveCategory = async () => {
        if (!currentCategory.name) return;

        setIsSaving(true);
        try {
            if (currentCategory.id) {
                await db.updateCategory(currentCategory.id, currentCategory.name);
            } else {
                await db.createCategory(currentCategory.name);
            }
            await fetchData();
            setCurrentCategory({});
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erro ao salvar categoria.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Tem certeza? Isso falhará se houver produtos nesta categoria.')) return;

        try {
            await db.deleteCategory(id);
            await fetchData();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert(error.message || 'Erro ao excluir categoria.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.corCodigo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin_dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Voltar ao Dashboard"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="text-blue-600" />
                            Gerenciamento de Catálogo
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => window.open('/catalogo', '_blank')}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors mr-2"
                            title="Ver Loja"
                        >
                            <Eye size={20} />
                            <span className="hidden sm:inline">Ver Loja</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'categories'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Categorias
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'products' ? (
                    <>
                        {/* Products Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full sm:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            <button
                                onClick={handleNewProduct}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                                Novo Produto
                            </button>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-square relative bg-gray-100">
                                        {product.image_path ? (
                                            <img
                                                src={product.image_path}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ImageIcon size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-blue-50 text-blue-600 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                                {product.category_name}
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                R$ {product.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Cód: {product.corCodigo || 'N/A'}
                                        </p>
                                        <div className="text-xs text-gray-400">
                                            Estoque: {product.stock || 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Categories List */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Gerenciar Categorias</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nova categoria"
                                        value={currentCategory.name || ''}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={handleSaveCategory}
                                        disabled={!currentCategory.name || isSaving}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {currentCategory.id ? 'Atualizar' : 'Adicionar'}
                                    </button>
                                    {currentCategory.id && (
                                        <button
                                            onClick={() => setCurrentCategory({})}
                                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <div key={category.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <span className="text-gray-700 font-medium">{category.name}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentCategory(category)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentProduct({});
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nome *</label>
                                    <input
                                        type="text"
                                        value={currentProduct.name || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Código/Cor</label>
                                    <input
                                        type="text"
                                        value={currentProduct.corCodigo || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, corCodigo: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Preço (R$) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={currentProduct.price || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Estoque</label>
                                    <input
                                        type="number"
                                        value={currentProduct.stock || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Categoria *</label>
                                    <select
                                        value={currentProduct.category_id || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="">Selecione...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">URL da Imagem</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentProduct.image_path || ''}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, image_path: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="https://..."
                                    />
                                    {currentProduct.image_path && (
                                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={currentProduct.image_path} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Descrição</label>
                                <textarea
                                    value={currentProduct.description || ''}
                                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentProduct({});
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="animate-spin" size={16} />}
                                Salvar Produto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
