
ALTER TABLE public.cancer_cases
  ADD COLUMN IF NOT EXISTS valide_par_medecin_id uuid,
  ADD COLUMN IF NOT EXISTS valide_par_registreur_id uuid,
  ADD COLUMN IF NOT EXISTS valide_le timestamptz;

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  diff jsonb,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view audit log" ON public.audit_log;
CREATE POLICY "Admin can view audit log"
  ON public.audit_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "System can insert audit log" ON public.audit_log;
CREATE POLICY "System can insert audit log"
  ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_diff jsonb;
  v_action text;
  v_entity_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'INSERT';
    v_diff := to_jsonb(NEW);
    v_entity_id := NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'UPDATE';
    v_diff := jsonb_build_object('before', to_jsonb(OLD), 'after', to_jsonb(NEW));
    v_entity_id := NEW.id;
  ELSE
    v_action := 'DELETE';
    v_diff := to_jsonb(OLD);
    v_entity_id := OLD.id;
  END IF;

  INSERT INTO public.audit_log(user_id, action, entity_type, entity_id, diff)
  VALUES (auth.uid(), v_action, TG_TABLE_NAME, v_entity_id, v_diff);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_cancer_cases ON public.cancer_cases;
CREATE TRIGGER audit_cancer_cases AFTER INSERT OR UPDATE OR DELETE ON public.cancer_cases
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_patients ON public.patients;
CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_traitements ON public.traitements;
CREATE TRIGGER audit_traitements AFTER INSERT OR UPDATE OR DELETE ON public.traitements
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_patient_files ON public.patient_files;
CREATE TRIGGER audit_patient_files AFTER INSERT OR UPDATE OR DELETE ON public.patient_files
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TABLE IF NOT EXISTS public.data_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid,
  researcher_name text NOT NULL,
  researcher_email text NOT NULL,
  institution text NOT NULL,
  project_title text NOT NULL,
  justification text NOT NULL,
  fields_requested jsonb NOT NULL DEFAULT '[]'::jsonb,
  filters jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  decided_by uuid,
  decided_at timestamptz,
  decision_note text,
  export_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dar_status ON public.data_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_dar_requester ON public.data_access_requests(requester_id);

ALTER TABLE public.data_access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view all access requests" ON public.data_access_requests;
CREATE POLICY "Admin can view all access requests"
  ON public.data_access_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Requesters can view own requests" ON public.data_access_requests;
CREATE POLICY "Requesters can view own requests"
  ON public.data_access_requests FOR SELECT TO authenticated
  USING (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Authenticated can create requests" ON public.data_access_requests;
CREATE POLICY "Authenticated can create requests"
  ON public.data_access_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Admin can update requests" ON public.data_access_requests;
CREATE POLICY "Admin can update requests"
  ON public.data_access_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admin can delete requests" ON public.data_access_requests;
CREATE POLICY "Admin can delete requests"
  ON public.data_access_requests FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_dar_updated ON public.data_access_requests;
CREATE TRIGGER trg_dar_updated BEFORE UPDATE ON public.data_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP POLICY IF EXISTS "Medecin valideur can validate cases" ON public.cancer_cases;
CREATE POLICY "Medecin valideur can validate cases"
  ON public.cancer_cases FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'medecin_valideur'::app_role));
