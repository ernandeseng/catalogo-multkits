-- Enable pgcrypto extension to generate password hash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the admin user's password to 'multkits77'
-- Replace the ID below if your admin ID is different
UPDATE auth.users
SET encrypted_password = crypt('multkits77', gen_salt('bf'))
WHERE id = '32549216-7243-4354-9419-798836561217';
