
-- Table for admin-managed form configuration (field options, cancer types, subtypes, etc.)
CREATE TABLE public.form_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  parent_value text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint per category+value
ALTER TABLE public.form_config ADD CONSTRAINT form_config_category_value_unique UNIQUE (category, value);

-- Enable RLS
ALTER TABLE public.form_config ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read
CREATE POLICY "Authenticated can view form config" ON public.form_config FOR SELECT TO authenticated USING (true);

-- Only admin can manage
CREATE POLICY "Admin can insert form config" ON public.form_config FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update form config" ON public.form_config FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete form config" ON public.form_config FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Table for admin-managed custom fields
CREATE TABLE public.custom_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_name text NOT NULL UNIQUE,
  field_label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  tab_id text NOT NULL DEFAULT 'suivi',
  is_required boolean DEFAULT false,
  options jsonb,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view custom fields" ON public.custom_fields FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert custom fields" ON public.custom_fields FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update custom fields" ON public.custom_fields FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can delete custom fields" ON public.custom_fields FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Drop rendez_vous table
DROP TABLE IF EXISTS public.rendez_vous;

-- Seed default cancer types
INSERT INTO public.form_config (category, label, value, sort_order) VALUES
  ('cancer_type', 'Poumon', 'Poumon', 1),
  ('cancer_type', 'Colorectal', 'Colorectal', 2),
  ('cancer_type', 'Sein', 'Sein', 3),
  ('cancer_type', 'Prostate', 'Prostate', 4),
  ('cancer_type', 'Vessie', 'Vessie', 5),
  ('cancer_type', 'Estomac', 'Estomac', 6),
  ('cancer_type', 'Foie', 'Foie', 7),
  ('cancer_type', 'Pancréas', 'Pancréas', 8),
  ('cancer_type', 'Rein', 'Rein', 9),
  ('cancer_type', 'Thyroïde', 'Thyroïde', 10),
  ('cancer_type', 'Leucémie', 'Leucémie', 11),
  ('cancer_type', 'Lymphome', 'Lymphome', 12),
  ('cancer_type', 'Mélanome', 'Mélanome', 13),
  ('cancer_type', 'Col utérin', 'Col utérin', 14),
  ('cancer_type', 'Ovaire', 'Ovaire', 15),
  ('cancer_type', 'Cavité buccale', 'Cavité buccale', 16),
  ('cancer_type', 'Larynx', 'Larynx', 17),
  ('cancer_type', 'Œsophage', 'Œsophage', 18),
  ('cancer_type', 'Cerveau/SNC', 'Cerveau/SNC', 19),
  ('cancer_type', 'Sarcome', 'Sarcome', 20),
  ('cancer_type', 'Myélome', 'Myélome', 21),
  ('cancer_type', 'Autre', 'Autre', 22),
  ('commune', 'Tlemcen', 'Tlemcen', 1),
  ('commune', 'Mansourah', 'Mansourah', 2),
  ('commune', 'Chetouane', 'Chetouane', 3),
  ('commune', 'Remchi', 'Remchi', 4),
  ('commune', 'Ghazaouet', 'Ghazaouet', 5),
  ('commune', 'Maghnia', 'Maghnia', 6),
  ('commune', 'Sebdou', 'Sebdou', 7),
  ('commune', 'Hennaya', 'Hennaya', 8),
  ('commune', 'Nedroma', 'Nedroma', 9),
  ('commune', 'Beni Snous', 'Beni Snous', 10),
  ('commune', 'Ouled Mimoun', 'Ouled Mimoun', 11),
  ('commune', 'Ain Tallout', 'Ain Tallout', 12),
  ('commune', 'Bab El Assa', 'Bab El Assa', 13),
  ('commune', 'Honaine', 'Honaine', 14),
  ('methode_diagnostic', 'Histologie', 'histologie', 1),
  ('methode_diagnostic', 'Cytologie', 'cytologie', 2),
  ('methode_diagnostic', 'Clinique seule', 'clinique', 3),
  ('methode_diagnostic', 'Imagerie', 'imagerie', 4),
  ('methode_diagnostic', 'Marqueurs biochimiques', 'biochimie', 5),
  ('methode_diagnostic', 'Certificat de décès (DCO)', 'dco', 6),
  ('grade', 'G1 — Bien différencié', 'G1 — Bien différencié', 1),
  ('grade', 'G2 — Moyennement différencié', 'G2 — Moyennement différencié', 2),
  ('grade', 'G3 — Peu différencié', 'G3 — Peu différencié', 3),
  ('grade', 'G4 — Indifférencié', 'G4 — Indifférencié', 4),
  ('grade', 'GX — Non évalué', 'GX — Non évalué', 5);
