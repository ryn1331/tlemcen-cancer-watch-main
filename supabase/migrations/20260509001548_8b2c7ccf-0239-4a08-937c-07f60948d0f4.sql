
CREATE TABLE IF NOT EXISTS public.quality_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  metrics jsonb DEFAULT '{}'::jsonb,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quality_alerts_resolved ON public.quality_alerts(resolved, created_at DESC);

ALTER TABLE public.quality_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view alerts"
  ON public.quality_alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert alerts"
  ON public.quality_alerts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Epi and admin can resolve alerts"
  ON public.quality_alerts FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'epidemiologiste'::app_role));

CREATE POLICY "Admin can delete alerts"
  ON public.quality_alerts FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
