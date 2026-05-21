import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, FilePlus, List, BarChart3, MessageSquare, LogOut, Shield, Activity,
  Microscope, ClipboardList, Globe, ChevronRight, ShieldCheck, FileSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = { to: string; icon: React.ElementType; label: string };

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  admin: [
    { to: '/admin', icon: Shield, label: 'Administration' },
    { to: '/audit', icon: ShieldCheck, label: 'Journal d\'audit' },
    { to: '/demandes-acces', icon: FileSearch, label: 'Demandes d\'accès' },
  ],
  medecin: [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/nouveau-cas', icon: FilePlus, label: 'Nouveau Cas' },
    { to: '/cas', icon: List, label: 'Liste des Cas' },
    { to: '/statistiques', icon: BarChart3, label: 'Statistiques' },
    { to: '/discussion', icon: MessageSquare, label: 'Discussion RCP' },
    { to: '/demandes-acces', icon: FileSearch, label: 'Demandes d\'accès' },
  ],
  epidemiologiste: [
    { to: '/epidemiologiste', icon: BarChart3, label: 'Statistiques' },
    { to: '/cas', icon: List, label: 'Liste des Cas' },
    { to: '/cartographie', icon: Globe, label: 'Cartographie' },
    { to: '/discussion', icon: MessageSquare, label: 'Discussion RCP' },
    { to: '/demandes-acces', icon: FileSearch, label: 'Demandes d\'accès' },
  ],
  anapath: [
    { to: '/anapath', icon: Microscope, label: 'Anatomopath.' },
    { to: '/cas', icon: List, label: 'Liste des Cas' },
    { to: '/discussion', icon: MessageSquare, label: 'Discussion RCP' },
  ],
  assistante: [
    { to: '/assistante', icon: ClipboardList, label: 'Accueil' },
    { to: '/nouveau-cas', icon: FilePlus, label: 'Nouveau Patient' },
    { to: '/cas', icon: List, label: 'Liste des Cas' },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrateur',
  medecin: 'Médecin',
  epidemiologiste: 'Épidémiologiste',
  anapath: 'Anatomopathologiste',
  assistante: 'Assistante',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { fullName, role, signOut } = useAuth();
  const location = useLocation();

  const roleLabel = ROLE_LABELS[role || 'medecin'] || 'Utilisateur';
  const navItems = NAV_BY_ROLE[role || 'medecin'] || NAV_BY_ROLE.medecin;

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content — WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-[260px] z-40 bg-card border-r border-border/60"
        aria-label="Navigation principale"
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-border/60">
          <Link to="/" className="flex items-center gap-3 rounded-lg" aria-label="Accueil — Registre Cancer Tlemcen">
            <div className="w-10 h-10 rounded-xl medical-gradient flex items-center justify-center shadow-md shadow-primary/15" aria-hidden="true">
              <Activity className="text-primary-foreground" size={20} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-foreground tracking-tight">Registre Cancer</p>
              <p className="text-[11px] text-muted-foreground font-medium">CHU Tlemcen · Algérie</p>
            </div>
          </Link>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
            <span className="text-[11px] text-primary font-semibold">{roleLabel}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Sections de l'application">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <span className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                      isActive
                        ? 'medical-gradient shadow-md shadow-primary/20 text-primary-foreground'
                        : 'bg-muted group-hover:bg-primary/10'
                    )} aria-hidden="true">
                      <item.icon size={16} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight size={14} className="text-primary/60" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border/60">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-9 h-9 rounded-full medical-gradient flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md shadow-primary/15"
              aria-hidden="true"
            >
              {fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{fullName || 'Utilisateur'}</p>
              <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full h-9 gap-2"
            aria-label="Se déconnecter"
          >
            <LogOut size={14} aria-hidden="true" />
            <span className="text-xs">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50"
        role="banner"
      >
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Accueil — Registre Cancer">
            <div className="w-8 h-8 rounded-lg medical-gradient flex items-center justify-center shadow-sm" aria-hidden="true">
              <Activity className="text-primary-foreground" size={16} />
            </div>
            <div>
              <span className="font-display font-bold text-sm">Registre Cancer</span>
              <span className="text-[10px] text-muted-foreground ml-1.5">{roleLabel}</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-11 w-11"
            aria-label="Se déconnecter"
          >
            <LogOut size={18} aria-hidden="true" />
          </Button>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav lg:hidden" aria-label="Navigation mobile">
        <ul className="flex items-center justify-around px-2 py-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl text-xs transition-all min-w-[56px] min-h-[44px]',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <span className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                    isActive && 'bg-primary/10'
                  )} aria-hidden="true">
                    <item.icon size={18} />
                  </span>
                  <span className="truncate max-w-[64px] font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="lg:pl-[260px] pt-14 lg:pt-0 pb-20 lg:pb-0 focus:outline-none"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="lg:pl-[260px] border-t border-border/50 bg-muted/20"
        role="contentinfo"
      >
        <div className="px-4 md:px-6 lg:px-8 py-3 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>Registre du Cancer — CHU Tlemcen · Conforme Loi 25-11 ANPDP — Données Santé DZ</span>
          <a href="mailto:dpo@chu-tlemcen.dz" className="hover:text-foreground transition-colors">
            DPO : dpo@chu-tlemcen.dz
          </a>
        </div>
      </footer>
    </div>
  );
}
