
-- Add separate glass power columns for each eye
ALTER TABLE public.patients ADD COLUMN glass_power_re text;
ALTER TABLE public.patients ADD COLUMN glass_power_le text;

-- Add end date for camp assignments to support date ranges
ALTER TABLE public.camp_assignments ADD COLUMN assignment_end_date date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days')::date;
