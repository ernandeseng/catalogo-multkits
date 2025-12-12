-- Enable pgcrypto extension to generate password hash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the admin user's password to 'multkits77' based on EMAIL
UPDATE auth.users
SET encrypted_password = crypt('multkits77', gen_salt('bf'))
WHERE email = 'douglasernandes87@gmail.com';
