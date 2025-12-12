-- Este script garante que o usuário admin exista com a senha e status corretos.
-- Copie e cole todo o conteúdo abaixo no SQL Editor do Supabase e execute.

DO $$
DECLARE
  target_email TEXT := 'multkitsbrasil@gmail.com';
  target_password TEXT := 'multkits77';
  hashed_password TEXT;
BEGIN
  -- Gera o hash da senha
  hashed_password := crypt(target_password, gen_salt('bf'));

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = target_email) THEN
    -- CASO 1: Usuário já existe -> Atualiza senha e confirma o email
    UPDATE auth.users
    SET encrypted_password = hashed_password,
        email_confirmed_at = COALESCE(email_confirmed_at, now()), -- Garante que está confirmado
        updated_at = now()
    WHERE email = target_email;
    
    RAISE NOTICE 'Usuário % atualizado com sucesso.', target_email;
  ELSE
    -- CASO 2: Usuário não existe -> Cria um novo usuário admin
    INSERT INTO auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      target_email,
      hashed_password,
      now(), -- Email já nasce confirmado
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name": "Admin Multkits"}',
      false,
      now(),
      now()
    );
    
    RAISE NOTICE 'Usuário % criado com sucesso.', target_email;
  END IF;
END $$;
