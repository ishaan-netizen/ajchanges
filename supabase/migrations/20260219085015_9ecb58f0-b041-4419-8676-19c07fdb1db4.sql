
-- Create sequence for camp IDs
CREATE SEQUENCE IF NOT EXISTS camp_seq START 1;

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('registrar', 'optometrist', 'counsellor');

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  role app_role NOT NULL DEFAULT 'registrar',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- User roles table (separate as per security requirements)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Camps table
CREATE TABLE public.camps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  camp_code text UNIQUE DEFAULT ('CAMP-' || to_char(now(), 'YYYY') || '-' || LPAD(nextval('camp_seq')::text, 3, '0')),
  name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  vertical text DEFAULT 'General',
  district text,
  block text,
  state text DEFAULT 'Bihar',
  village text,
  base_hospital text,
  status text DEFAULT 'Upcoming',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.camps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view camps"
  ON public.camps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert camps"
  ON public.camps FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update camps"
  ON public.camps FOR UPDATE TO authenticated USING (true);

-- Camp assignments (maps users to camps by date)
CREATE TABLE public.camp_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  camp_id uuid NOT NULL REFERENCES public.camps(id) ON DELETE CASCADE,
  assignment_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, assignment_date)
);

ALTER TABLE public.camp_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assignments"
  ON public.camp_assignments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can view all assignments"
  ON public.camp_assignments FOR SELECT TO authenticated
  USING (true);

-- Patients table
CREATE TABLE public.patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id text UNIQUE,
  camp_id uuid NOT NULL REFERENCES public.camps(id),
  patient_type text DEFAULT 'New',
  full_name text NOT NULL,
  gender text,
  guardian_name text,
  guardian_mandatory boolean DEFAULT false,
  phone text,
  phone_relationship text DEFAULT 'Self',
  dob date,
  dob_status text DEFAULT 'Self Declared',
  age integer,
  id_proof_type text,
  id_proof_number text,
  address_door text,
  address_village text,
  address_block text,
  address_district text,
  address_state text,
  address_pincode text,
  consent_given boolean DEFAULT false,
  aadhar_photo_url text,
  patient_photo_url text,
  signature_url text,
  status text DEFAULT 'Registered',

  -- Optometrist fields
  chief_complaint text[],
  chief_complaint_other text,
  wears_glasses boolean,
  systemic_disease text[],
  systemic_disease_other text,
  vision_re_dist text,
  vision_le_dist text,
  vision_re_near text,
  vision_le_near text,
  vision_re_pinhole text,
  vision_le_pinhole text,
  conjunctiva_re text DEFAULT 'Normal',
  conjunctiva_le text DEFAULT 'Normal',
  cornea_re text DEFAULT 'Normal',
  cornea_le text DEFAULT 'Normal',
  iris_re text DEFAULT 'Normal',
  iris_le text DEFAULT 'Normal',
  pupil_re text DEFAULT 'Normal',
  pupil_le text DEFAULT 'Normal',
  lens_re text DEFAULT 'Normal',
  lens_le text DEFAULT 'Normal',
  fundus_re text DEFAULT 'Normal',
  fundus_le text DEFAULT 'Normal',
  diagnosis text[],
  diagnosis_other text,
  glass_power text,
  medicine text,
  medicine_other text,
  referral_needed boolean DEFAULT false,
  referral_purpose text,

  -- Counsellor fields
  spectacles_given boolean DEFAULT false,
  spectacles_power text,
  spectacles_payment_type text,
  amount_collected numeric DEFAULT 0,
  referral_center text,
  advance_collected boolean DEFAULT false,
  advance_amount numeric DEFAULT 0,
  referral_id text,

  registered_by uuid REFERENCES auth.users(id),
  examined_by uuid REFERENCES auth.users(id),
  counselled_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view patients"
  ON public.patients FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert patients"
  ON public.patients FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients"
  ON public.patients FOR UPDATE TO authenticated USING (true);

-- Auto-generate unique_id
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.unique_id := 'AJ-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD(nextval('camp_seq')::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_patient_unique_id
  BEFORE INSERT ON public.patients
  FOR EACH ROW
  WHEN (NEW.unique_id IS NULL)
  EXECUTE FUNCTION public.generate_patient_id();

-- Auto-calculate age from DOB
CREATE OR REPLACE FUNCTION public.calculate_age()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.dob IS NOT NULL THEN
    NEW.age := EXTRACT(YEAR FROM age(NEW.dob));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_patient_age
  BEFORE INSERT OR UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_age();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
