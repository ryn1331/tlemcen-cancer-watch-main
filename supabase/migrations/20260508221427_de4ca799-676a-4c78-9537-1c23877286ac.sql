
CREATE TABLE public.dismissed_duplicates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_a_id uuid NOT NULL,
  patient_b_id uuid NOT NULL,
  dismissed_by uuid,
  raison text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dismissed_pair_unique UNIQUE (patient_a_id, patient_b_id),
  CONSTRAINT dismissed_pair_ordered CHECK (patient_a_id < patient_b_id)
);

CREATE INDEX idx_dismissed_a ON public.dismissed_duplicates(patient_a_id);
CREATE INDEX idx_dismissed_b ON public.dismissed_duplicates(patient_b_id);

ALTER TABLE public.dismissed_duplicates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view dismissed pairs"
  ON public.dismissed_duplicates FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Medecin can dismiss duplicates"
  ON public.dismissed_duplicates FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'medecin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can remove dismissal"
  ON public.dismissed_duplicates FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
