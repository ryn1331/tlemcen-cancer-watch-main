import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const email = "admin@chu.fr";
    const password = "12345678";
    const full_name = "Administrateur";

    // Check existing
    const { data: list } = await admin.auth.admin.listUsers();
    let user = list?.users?.find((u) => u.email === email);

    if (!user) {
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { full_name, role: "admin" },
      });
      if (error) throw error;
      user = data.user;
    } else {
      await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    }

    // Ensure role = admin
    await admin.from("user_roles").delete().eq("user_id", user!.id);
    await admin.from("user_roles").insert({ user_id: user!.id, role: "admin" });
    await admin.from("profiles").upsert({ user_id: user!.id, full_name }, { onConflict: "user_id" });

    return new Response(JSON.stringify({ success: true, user_id: user!.id, email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
