import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_path: string;
  corCodigo?: string;
  variations?: { name: string; price: number }[];
  stock?: number;
  category_name: string;
};

export const db = {
  init: async () => {
    // Table initialization is now handled via setup_supabase.sql
    console.log('Database should be initialized using setup_supabase.sql in the Supabase Dashboard.');
  },

  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('id', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      ...row,
      price: Number(row.price),
      corCodigo: row.cor_codigo,
      variations: row.variations || undefined,
      category_name: row.categories?.name || ''
    })) as Product[];
  },

  createProduct: async (product: Omit<Product, 'id' | 'category_name'>) => {
    const { name, description, price, category_id, image_path, corCodigo, variations, stock } = product;
    
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        category_id,
        image_path,
        cor_codigo: corCodigo,
        variations,
        stock
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateProduct: async (id: number, updates: Partial<Product>) => {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
    if (updates.image_path !== undefined) updateData.image_path = updates.image_path;
    if (updates.corCodigo !== undefined) updateData.cor_codigo = updates.corCodigo;
    if (updates.variations !== undefined) updateData.variations = updates.variations;
    if (updates.stock !== undefined) updateData.stock = updates.stock;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) return false;
    return true;
  },

  getProductById: async (id: number): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      price: Number(data.price),
      corCodigo: data.cor_codigo,
      variations: data.variations || undefined
    } as Product;
  },

  deleteProduct: async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  clearProducts: async () => {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', 0); // Delete all rows
      
    if (error) throw error;
  },

  createCategory: async (name: string) => {
    const { error } = await supabase
      .from('categories')
      .insert({ name });

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Categoria já existe');
      }
      throw error;
    }
  },

  updateCategory: async (id: number, name: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id);
      
    if (error) throw error;
  },

  deleteCategory: async (id: number) => {
    // Check for products first
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error('Não é possível excluir categoria com produtos vinculados');
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export default db;

