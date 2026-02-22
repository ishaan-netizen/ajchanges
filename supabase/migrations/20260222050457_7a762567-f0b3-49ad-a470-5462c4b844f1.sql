
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS eye_image_re_url text,
  ADD COLUMN IF NOT EXISTS eye_image_le_url text,
  ADD COLUMN IF NOT EXISTS lens_type text;
