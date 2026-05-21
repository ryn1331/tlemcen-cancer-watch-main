import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Activity, Shield, Database, Globe, Lock, BarChart3, Map } from 'lucide-react';

export default function Auth() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Connexion réussie');
    } catch (err: any) {
      const msg = err.message || 'Identifiants incorrects';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex">
      {/* Left: branding panel */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary/[0.03] via-accent/[0.02] to-primary/[0.05]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl medical-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
                Registre du Cancer
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Wilaya de Tlemcen
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-foreground leading-tight mb-4">
              Plateforme intégrée<br />
              <span className="text-gradient">
                de registre populationnel
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Collecte, analyse et cartographie des données oncologiques
              selon les standards internationaux IARC/OMS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: Database, label: 'Base structurée', desc: 'ICD-O-3, TNM, IARC' },
              { icon: Globe, label: 'Cartographie SIG', desc: '58 wilayas, communes' },
              { icon: Shield, label: 'Conforme ANPDP', desc: 'Loi 25-11 protection' },
              { icon: Lock, label: 'Accès sécurisé', desc: 'Multi-rôles, RLS' },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/40 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-xs font-semibold">{f.label}</p>
                  <p className="text-muted-foreground text-[10px]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-muted-foreground/60 text-[10px]">
          <span>CHU Tlemcen</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Ministère de la Santé</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>INSP Algérie</span>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl medical-gradient flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
              <Activity className="text-primary-foreground" size={24} />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Registre du Cancer</h1>
            <p className="text-muted-foreground text-sm mt-1">CHU Tlemcen — Wilaya de Tlemcen</p>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-xl shadow-primary/[0.03]">
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-lg text-foreground">Connexion</h2>
              <p className="text-muted-foreground text-sm mt-1">Accès réservé au personnel autorisé</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-describedby={error ? 'auth-error' : undefined}>
              {error && (
                <div
                  id="auth-error"
                  role="alert"
                  aria-live="assertive"
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium"
                >
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-foreground/80 text-sm" required>Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="medecin@chu-tlemcen.dz"
                  required
                  autoComplete="username"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-required="true"
                  aria-invalid={!!error || undefined}
                  className="mt-1.5 h-11"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground/80 text-sm" required>Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!error || undefined}
                  aria-describedby="password-hint"
                  className="mt-1.5 h-11"
                />
                <p id="password-hint" className="sr-only">Minimum 6 caractères</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 medical-gradient text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                disabled={loading}
                aria-busy={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                {loading ? 'Connexion en cours…' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-border/60 text-center">
              <p className="text-muted-foreground text-xs">
                Contactez l'administrateur pour obtenir un compte
              </p>
            </div>
          </div>

          <div className="mt-6 text-center space-y-1">
            <p className="text-muted-foreground/60 text-[10px]">
              Registre du Cancer — CHU Tlemcen
            </p>
            <p className="text-muted-foreground/40 text-[10px]">
              Conforme Loi 25-11 ANPDP · Hébergement données de santé DZ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
