
-- Saved maps for the epidemiologist map builder
CREATE TABLE public.geo_saved_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.geo_saved_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Epi and admin can view saved maps" ON public.geo_saved_maps
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Epi and admin can insert saved maps" ON public.geo_saved_maps
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Epi and admin can update own saved maps" ON public.geo_saved_maps
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Epi and admin can delete own saved maps" ON public.geo_saved_maps
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE TRIGGER update_geo_saved_maps_updated_at
  BEFORE UPDATE ON public.geo_saved_maps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Custom zone groups
CREATE TABLE public.geo_zone_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.geo_zone_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Epi and admin can view zone groups" ON public.geo_zone_groups
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Epi and admin can insert zone groups" ON public.geo_zone_groups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Epi and admin can update own zone groups" ON public.geo_zone_groups
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE POLICY "Epi and admin can delete own zone groups" ON public.geo_zone_groups
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin')));

CREATE TRIGGER update_geo_zone_groups_updated_at
  BEFORE UPDATE ON public.geo_zone_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Items in zone groups
CREATE TABLE public.geo_zone_group_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.geo_zone_groups(id) ON DELETE CASCADE,
  zone_type TEXT NOT NULL DEFAULT 'wilaya',
  zone_code TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  custom_geometry JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.geo_zone_group_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Epi and admin can view zone group items" ON public.geo_zone_group_items
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Epi and admin can insert zone group items" ON public.geo_zone_group_items
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Epi and admin can update zone group items" ON public.geo_zone_group_items
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Epi and admin can delete zone group items" ON public.geo_zone_group_items
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'epidemiologiste') OR has_role(auth.uid(), 'admin'));
