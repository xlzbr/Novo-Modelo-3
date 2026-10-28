import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  CalendarDays,
  BookOpen,
  TrendingUp,
  FileText,
  Bell,
  MapPin,
  User,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { ViewType } from '../types';
import { FoliumLogo } from './FoliumLogo';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: (ctx: { pendingCount: number; unreadCount: number }) => number | null;
  badgeColor?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'tasks',
    label: 'Tarefas Acadêmicas',
    icon: CheckSquare,
    badgeCount: (ctx) => ctx.pendingCount || 3,
    badgeColor: 'bg-[#346BDB] text-white',
  },
  { id: 'schedule', label: 'Agenda Diária', icon: Calendar },
  { id: 'calendar', label: 'Horários e Calendário', icon: CalendarDays },
  { id: 'disciplines', label: 'Disciplinas', icon: BookOpen },
  { id: 'progress', label: 'Progresso Acadêmico', icon: TrendingUp },
  { id: 'materials', label: 'Materiais de Estudo', icon: FileText },
  {
    id: 'notices',
    label: 'Notificações e Avisos',
    icon: Bell,
    badgeCount: (ctx) => ctx.unreadCount || 4,
    badgeColor: 'bg-[#E84B58] text-white',
  },
  { id: 'campus-map', label: 'Mapa do Campus', icon: MapPin },
  { id: 'profile', label: 'Meu Perfil', icon: User },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const StudentAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const dim = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  return (
    <div
      className={`relative ${dim} rounded-full overflow-hidden bg-gradient-to-br from-[#346BDB] to-[#102038] ring-2 ring-white/20 shadow-xs shrink-0 flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
        <circle cx="50" cy="50" r="50" fill="#132238" />
        <circle cx="50" cy="38" r="18" fill="#F8D3B0" />
        <path d="M30 36 C30 22, 70 22, 70 36 C68 25, 32 25, 30 36 Z" fill="#2E1F1A" />
        <path d="M32 30 C35 20, 65 20, 68 30 C64 24, 36 24, 32 30 Z" fill="#1C1310" />
        <rect x="37" y="35" width="10" height="7" rx="2" fill="none" stroke="#203A65" strokeWidth="2" />
        <rect x="53" y="35" width="10" height="7" rx="2" fill="none" stroke="#203A65" strokeWidth="2" />
        <line x1="47" y1="38" x2="53" y2="38" stroke="#203A65" strokeWidth="2" />
        <path d="M44 47 Q50 51 56 47" fill="none" stroke="#A76045" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 92 C22 66, 78 66, 78 92 Z" fill="#346BDB" />
        <polygon points="50,68 44,78 56,78" fill="#FFFFFF" />
      </svg>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    tasks,
    unreadNotificationCount,
    theme,
    toggleTheme,
    preferences,
  } = useEdu();

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <aside
      className="hidden md:flex flex-col bg-[#102038] dark:bg-[#0A1322] border-r border-[#1B2F4D] text-slate-300 w-64 select-none shrink-0 h-screen transition-colors duration-250 z-20 justify-between shadow-xl"
      aria-label="Navegação Principal Folium"
    >
      {/* Topo / Marca Oficial Folium */}
      <div>
        <div className="h-20 flex items-center px-6 border-b border-[#1B2F4D] shrink-0">
          <FoliumLogo
            variant="dark"
            size="md"
            showSlogan={true}
            sloganText="CONHECIMENTO EM CADA ETAPA"
          />
        </div>

        {/* 11 Itens de Navegação oficiais */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]" role="navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const count = item.badgeCount
              ? item.badgeCount({ pendingCount, unreadCount: unreadNotificationCount })
              : null;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer group text-left ${
                  isActive
                    ? 'bg-[#1E3557] text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-[#162742]'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#60A5FA]' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {count !== null && count > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || 'bg-[#346BDB] text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Seção Inferior: Card Inspiracional + Tema & Aluno */}
      <div className="p-3 border-t border-[#1B2F4D] space-y-2.5 shrink-0 bg-[#0E1A2E]/60">
        {/* Card Motivacional: "Grandes conquistas começam com organização." */}
        <div
          onClick={() => setActiveView('schedule')}
          className="bg-[#162742] hover:bg-[#1B3255] border border-[#21385C] rounded-xl p-3 cursor-pointer transition-colors group flex items-center justify-between"
          title="Ver agenda de estudos"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-base shrink-0">🌱</span>
            <p className="text-[11px] font-medium text-slate-200 leading-snug truncate group-hover:text-white">
              Grandes conquistas começam com organização.
            </p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
        </div>

        {/* Botão de Tema (Modo claro / Modo escuro) */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#162742] transition-colors cursor-pointer border border-[#21385C]"
          aria-label="Alternar tema claro e escuro"
        >
          <div className="flex items-center space-x-2.5">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span>{theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Card do Estudante */}
        <button
          onClick={() => setActiveView('profile')}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#162742] transition-colors cursor-pointer text-left group"
          aria-label="Acessar Meu Perfil"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <StudentAvatar size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate group-hover:text-[#93C5FD] transition-colors">
                {preferences.shortName || 'Lucas Andrade'}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Aluno
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
        </button>
      </div>
    </aside>
  );
};
