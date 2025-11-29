-- Add new columns to users_profile
ALTER TABLE users_profile 
ADD COLUMN IF NOT EXISTS document text,
ADD COLUMN IF NOT EXISTS phone text;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users_profile (id, full_name, email, status, document, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'pending',
    new.raw_user_meta_data->>'document',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
