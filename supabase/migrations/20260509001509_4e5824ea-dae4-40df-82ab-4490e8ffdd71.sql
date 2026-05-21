
ALTER TABLE public.cancer_cases ALTER COLUMN statut SET DEFAULT 'valide';
DROP POLICY IF EXISTS "Medecin valideur can validate cases" ON public.cancer_cases;
