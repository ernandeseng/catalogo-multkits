-- Create tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_path TEXT,
  cor_codigo TEXT,
  stock INTEGER DEFAULT 0,
  variations JSONB
);

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create active_sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
  user_id uuid REFERENCES auth.users(id),
  device_id text NOT NULL,
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  PRIMARY KEY (user_id)
);

-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can view their own profile" ON users_profile;
DROP POLICY IF EXISTS "Admin can view all profiles" ON users_profile;
DROP POLICY IF EXISTS "Admin can update profiles" ON users_profile;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON active_sessions;

-- Policies for users_profile
CREATE POLICY "Users can insert their own profile" 
ON users_profile FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" 
ON users_profile FOR SELECT 
USING (auth.uid() = id);

-- Admin Policies
-- NOTE: Replace with actual ADMIN_ID
CREATE POLICY "Admin can view all profiles" 
ON users_profile FOR SELECT 
USING (auth.uid() = 'a873f6bc-6d33-4e17-ab95-713347011c75'::uuid);

CREATE POLICY "Admin can update profiles" 
ON users_profile FOR UPDATE 
USING (auth.uid() = 'a873f6bc-6d33-4e17-ab95-713347011c75'::uuid);

-- Policies for active_sessions
CREATE POLICY "Users can manage their own sessions" 
ON active_sessions FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for public access to products and categories (Catalog)
CREATE POLICY "Public can view categories" 
ON categories FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Public can view products" 
ON products FOR SELECT 
TO anon, authenticated 
USING (true);


-- Insert Categories
INSERT INTO categories (id, name) VALUES
  (1, 'Tubos'),
  (2, 'Rolamentos'),
  (3, 'Rodízios'),
  (4, 'Tampas'),
  (5, 'Estacionamentos'),
  (6, 'Saídas'),
  (7, 'Acabamentos'),
  (8, 'Fechaduras'),
  (9, 'Roldanas'),
  (10, 'Aparadores'),
  (11, 'Batentes')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for categories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Insert Products
INSERT INTO products (id, name, description, price, category_id, image_path, cor_codigo, stock, variations) VALUES
  (1, 'Saída com Guia Universal - Casinha', 'Saída com Guia Universal para Casinha. Robusto e eficiente com baixo custo. Disponível nas cores branco e preto - Embalagem: 100 unidades no mix de cores', 1.96, 6, 'https://i.imgur.com/jq0lXWQ.jpeg', 'SGU-b (Branco) / SGU-p (Preto)', 150, null),
  (2, 'Acabamento Saída Inferior', 'Acabamento Saída Inferior (acabamento de pino guia). Robusto e eficiente com baixo custo. Disponível nas cores branco e preto - Embalagem: 200 unidades no mix de cores', 0.40, 7, 'https://i.imgur.com/zKBcQWh.jpeg', 'APG-b (Branco) / APG-p (Preto)', 300, null),
  (3, 'Tampa do Leito do Vidro 8 e 10mm', 'Tampa do Leito do Vidro de 8 e 10mm. Nylon Flexível, para leitos Olga e Euro. Disponível em múltiplas variações - Embalagem: 500 unidades', 0.15, 4, 'https://i.imgur.com/sm8RW5h.jpeg', 'TLL-b (Olga Branca) / TLL-p (Olga Preta) / TL2-b (Euro Branca) / TL2-p (Euro Preta)', 500, null),
  (4, 'Rolamento 608 2 RS Injetado', 'Rolamento 608 2 RS Injetado em Nylon Virgem Aditivado. Inquebrável e mais silencioso. Disponível em versão natural e preta - Embalagem: 500 unidades', 0.55, 2, 'https://i.imgur.com/QYKdKPS.jpeg', 'RIN (Injetado) / RIP (Preto)', 200, null),
  (5, 'Rodízio SEM rolamento', 'Rodízio SEM rolamento em polímero especial. Fórmula exclusiva com lubrificante sólido. Específico para o litoral. Cor Grafite - Embalagem: 500 unidades', 0.57, 3, 'https://i.imgur.com/IgIIAf3.jpeg', 'RSR', 100, null),
  (6, 'Estacionamento Duplo Antiqueda', 'Estacionamento Duplo Antiqueda com 3 Cavidades. Injetado em Nylon aditivado anti desgaste. Cor Preto - Embalagem: 200 unidades', 1.15, 5, 'https://i.imgur.com/XU8pwq5.jpeg', 'EDA', 80, null),
  (7, 'Estacionamento Duplo', 'Estacionamento Duplo com 2 Cavidades. Injetado em Nylon aditivado anti desgaste. Cor Preto - Embalagem: 200 unidades', 0.95, 5, 'https://i.imgur.com/IzDvZQl.jpeg', 'ED', 90, null),
  (8, 'Estacionamento Simples (palito)', 'Estacionamento Simples (palito) com 3 Cavidades. Injetado em Nylon aditivado anti desgaste. Cor Preto - Embalagem: 400 unidades', 0.32, 5, 'https://i.imgur.com/1nId584.jpeg', 'ES', 120, null),
  (9, 'Kit Roldana em Inox', 'Kit Roldana em Inox rolamentos blindados e freio em Nylon aditivado com redutor de atrito e pino guia também em Nylon de alta resistência. Disponível nas cores branca e preta - Embalagem: 100 unidades', 21.80, 9, 'https://i.imgur.com/9jWxHEj.jpeg', 'KRI-01 (Branca) / KRI-02 (Preta)', 50, null),
  (10, 'Kit Patente/Pivô em Nylon 6', 'Kit Patente/Pivô em Nylon 6 reforçado e Eixo em Inox. Fixação por parafuso M4 Inox. Cor Sapata Nylon - Embalagem: 50 unidades', 17.20, 9, 'https://i.imgur.com/Izgosjd.jpeg', 'KBT-01', 40, null),
  (11, 'Aparador em Alumínio com haste dupla', 'Aparador em Alumínio com haste dupla Usinado. Pintura Epoxi Branca e Preta. Design e Acabamento Superiores. Disponível nas cores branca e preta - Embalagem: 40 unidades no mix de cores', 25.40, 10, 'https://i.imgur.com/k6kNteZ.jpeg', 'APA-b (Branca) / APA-p (Preta)', 60, null),
  (12, 'Aparador em Nylon', 'Aparador em Nylon Injetado em Inox. Ultra resistente. Elegância com economia. Disponível nas cores branca e preta - Embalagem: 50 unidades no mix de cores', 12.60, 10, 'https://i.imgur.com/nIg4SEK.jpeg', 'APN-b (Branca) / APN-p (Preta)', 75, null),
  (13, 'Fechadura Vidro-Vidro STYLE', 'Fechadura Vidro-Vidro STYLE 8 e 10mm. Policarbonato, Elegante e Ultra Resistente. Disponível nas cores branca e preta, para vidros de 8mm e 10mm - Embalagem: 40 unidades no mix de cores', 24.90, 8, 'https://i.imgur.com/EcXpMaA.jpeg', 'VV08-b (Branca) / VV010-b (Branca) / VV08-p (Preta) / VV010-p (Preta)', 30, '[{"name": "VV08-b (Branca) - 8mm", "price": 24.9}, {"name": "VV010-b (Branca) - 10mm", "price": 26.9}, {"name": "VV08-p (Preta) - 8mm", "price": 24.9}, {"name": "VV010-p (Preta) - 10mm", "price": 26.9}]'),
  (14, 'Fechadura Vidro-Vidro CLASSIC', 'Fechadura Vidro-Vidro CLASSIC 8 e 10mm. Policarbonato, Ultra Resistente, design clássico. Disponível nas cores branca e preta, para vidros de 8mm e 10mm - Embalagem: 40 unidades no mix de cores', 22.90, 8, 'https://i.imgur.com/1y4PK7W.jpeg', 'VVR8-b (Branca) / VVR8-p (Preta) / VVR10-b (Branca) / VVR10-p (Preta)', 35, null),
  (15, 'Fechadura Vidro-Leito para perfil', 'Fechadura Vidro-Leito para todos os modelos de perfil. Policarbonato, Ultra Resistente e Discreta. Chave e miolo em Latão ou Chave e miolo em Nylon. Cor Preta - Embalagem: 40 unidades', 16.80, 8, 'https://i.imgur.com/vBmZMqI.jpeg', 'VEB-latão (Preta) / VEBn-Nylon (Preta) / VEP-latão (Preta) / VEPn-Nylon (Preta)', 45, '[{"name": "VEB-latão (Preta)", "price": 16.8}, {"name": "VEBn-Nylon (Preta)", "price": 11.6}, {"name": "VEP-latão (Preta)", "price": 16.8}, {"name": "VEPn-Nylon (Preta)", "price": 11.6}]'),
  (16, 'Kit de Saída com Conjunto Antiqueda', 'Kit de Saída com Conjunto Antiqueda 10 peças: 01 Superior, 01 Inferior, 02 suportes de trilho e 06 de Leito. Saída superior com ou sem contorno de roldana. Disponível nas cores branco e preto - Embalagem: 50 unidades no mix de cores', 6.50, 6, 'https://i.imgur.com/Nttjym1.jpeg', 'KSE-b (Branco) / KSE-p (Preto)', 25, null),
  (17, 'Kit de Saída com Mola Guia Reversa', 'Kit de Saída com Mola Guia Reversa 03 peças: 01 Superior, 01 Inferior e 01 Mola Guia. Disponível nas cores branco e preto - Embalagem: 50 unidades no mix de cores', 8.90, 6, 'https://i.imgur.com/WQkDY92.jpeg', 'KSM-b (Branco) / KSM-p (Preto)', 20, null)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for products
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
