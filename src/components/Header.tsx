import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell,
  Menu,
  Check,
  CheckCheck,
  RotateCcw,
  Search,
  ChevronDown,
  X,
  BookOpen,
  CheckSquare,
  FileText,
  User,
  Settings,
  Sun,
  Moon,
  ExternalLink,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { NotificationItem, ViewType } from '../types';
import { StudentAvatar } from './Sidebar';
import { ProfileDropdownMenu } from './ProfileDropdownMenu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

type NotifFilter = 'all' | 'unread' | 'read';

export const Header: React.FC<HeaderProps> = () => {
  const {
    tasks,
    disciplines,
    materials,
    notices,
    notifications,
    unreadNotificationCount,
    preferences,
    setIsMobileMenuOpen,
    setActiveView,
    toggleNotificationRead,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    theme,
    toggleTheme,
  } = useEdu();

  // Estados dos menus dropdown
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [filter, setFilter] = useState<NotifFilter>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Estado da Busca Global
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fecha dropdowns ao clicar fora ou pressionar ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNotifOpen(false);
        setIsSearchFocused(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          setIsSearchFocused(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filtra as notificações conforme o filtro selecionado
  const displayedNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.read);
    }
    if (filter === 'read') {
      return notifications.filter((n) => n.read);
    }
    return notifications;
  }, [notifications, filter]);

  // Resultados da busca global
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    const matchedTasks = tasks
      .filter((t) => t.title.toLowerCase().includes(q) || t.discipline.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedDisciplines = disciplines
      .filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedMaterials = materials
      .filter((m) => m.title.toLowerCase().includes(q) || m.discipline.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedNotices = notices
      .filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q))
      .slice(0, 3);

    const totalCount =
      matchedTasks.length + matchedDisciplines.length + matchedMaterials.length + matchedNotices.length;

    return {
      tasks: matchedTasks,
      disciplines: matchedDisciplines,
      materials: matchedMaterials,
      notices: matchedNotices,
      totalCount,
    };
  }, [searchQuery, tasks, disciplines, materials, notices]);

  const handleSelectSearchResult = (view: ViewType) => {
    setActiveView(view);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setActionFeedback('Todas marcadas como lidas');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleToggleItemRead = (e: React.MouseEvent, notif: NotificationItem) => {
    e.stopPropagation();
    if (!notif.read) {
      markNotificationAsRead(notif.id);
    } else {
      toggleNotificationRead(notif.id);
    }
  };

  return (
    <header className="relative z-30 shrink-0 bg-white dark:bg-[#14223D] border-b border-[#E1E8F1] dark:border-[#344563] h-16 text-slate-800 dark:text-slate-100 select-none transition-colors duration-200">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Lado Esquerdo: Botão Mobile + Barra de Busca Global */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-[#203A65] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Campo de Busca oficial do topo */}
          <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3.5 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Buscar no Folium..."
                className="w-full bg-[#F7F9FC] dark:bg-[#1A2C4E] hover:bg-[#EFF4FA] dark:hover:bg-[#1E3359] focus:bg-white dark:focus:bg-[#14223D] border border-[#E1E8F1] dark:border-[#344563] focus:border-[#346BDB] dark:focus:border-[#60A5FA] text-[#203A65] dark:text-[#F8FAFC] placeholder-[#64748B] dark:placeholder-[#94A3B8] text-xs sm:text-sm rounded-xl pl-9 pr-14 py-2 transition-all outline-none focus:ring-2 focus:ring-[#346BDB]/20"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Dropdown de Resultados da Busca */}
            {isSearchFocused && searchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#14223D] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#344563] py-2.5 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-1.5 border-b border-slate-100 dark:border-[#344563] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Resultados para "{searchQuery}"</span>
                  <span className="font-mono font-semibold">{searchResults.totalCount} encontrado(s)</span>
                </div>

                {searchResults.totalCount === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    Nenhum resultado acadêmico encontrado para "{searchQuery}".
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-[#344563]">
                    {searchResults.tasks.length > 0 && (
                      <div className="p-2">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 block">
                          Tarefas Acadêmicas
                        </span>
                        {searchResults.tasks.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleSelectSearchResult('dashboard')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <CheckSquare className="w-3.5 h-3.5 text-[#346BDB] shrink-0" />
                              <span className="text-xs font-medium text-slate-800 dark:text-slate-100 group-hover:text-[#203A65] dark:group-hover:text-[#93C5FD] truncate">
                                {t.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                              {t.discipline}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.disciplines.length > 0 && (
                      <div className="p-2">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-2 mb-1 block">
                          Disciplinas
                        </span>
                        {searchResults.disciplines.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => handleSelectSearchResult('disciplines')}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center space-x-2.5 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-[#346BDB] shrink-0" />
                              <span className="text-xs font-medium text-slate-800 dark:text-slate-100 group-hover:text-[#203A65] dark:group-hover:text-[#93C5FD] truncate">
                                {d.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                              {d.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lado Direito: Seletor de Idioma, Sino de Notificação e Perfil do Usuário */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Seletor de Idioma (Estilo ENG / PT-BR do Mockup) */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
            <span>PT-BR</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Sino de Notificações */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#203A65] dark:hover:text-white hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E] rounded-xl transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-[#346BDB]/20"
              aria-label={`Notificações: ${unreadNotificationCount} não lidas`}
              aria-expanded={isNotifOpen}
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center text-[10px] font-bold text-white bg-[#E84B58] rounded-full font-mono tabular-nums ring-2 ring-white dark:ring-[#14223D]">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Dropdown de Notificações */}
            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#14223D] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#344563] py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                role="dialog"
                aria-label="Central de Notificações Folium"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-[#344563] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Notificações
                    </span>
                    {unreadNotificationCount > 0 ? (
                      <span className="text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-md font-mono tabular-nums">
                        {unreadNotificationCount} não lida(s)
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                        Todas lidas
                      </span>
                    )}
                  </div>

                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-[#346BDB] hover:text-[#203A65] dark:hover:text-[#93C5FD] flex items-center space-x-1 cursor-pointer hover:underline"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Marcar lidas</span>
                    </button>
                  )}
                </div>

                {/* Filtros de Notificação */}
                <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-100 dark:border-[#344563] flex items-center justify-between text-xs gap-1">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        filter === 'all'
                          ? 'bg-white dark:bg-[#1C3359] text-[#203A65] dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Todas ({notifications.length})
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        filter === 'unread'
                          ? 'bg-white dark:bg-[#1C3359] text-[#203A65] dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Não lidas ({unreadNotificationCount})
                    </button>
                    <button
                      onClick={() => setFilter('read')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        filter === 'read'
                          ? 'bg-white dark:bg-[#1C3359] text-[#203A65] dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Lidas
                    </button>
                  </div>

                  {actionFeedback && (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>{actionFeedback}</span>
                    </span>
                  )}
                </div>

                {/* Lista de Notificações */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#344563]">
                  {displayedNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      Nenhuma notificação encontrada neste filtro.
                    </div>
                  ) : (
                    displayedNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setActiveView('notices');
                          setIsNotifOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-[#1A2C4E] transition-colors cursor-pointer flex items-start space-x-3 relative ${
                          !notif.read ? 'bg-[#EFF4FA]/60 dark:bg-[#1C3359]/40' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#E84B58] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                            {notif.date}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleToggleItemRead(e, notif)}
                          className="absolute right-3 top-3.5 p-1 rounded-md text-slate-400 hover:text-[#203A65] dark:hover:text-white transition-colors cursor-pointer"
                          title={notif.read ? 'Marcar como não lida' : 'Marcar como lida'}
                        >
                          {notif.read ? (
                            <RotateCcw className="w-3.5 h-3.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2.5 border-t border-slate-100 dark:border-[#344563] flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Portal Acadêmico Folium</span>
                  <button
                    onClick={() => {
                      setActiveView('notices');
                      setIsNotifOpen(false);
                    }}
                    className="text-[#346BDB] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Ver Todas</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu de Perfil Fiel à Imagem de Referência */}
          <ProfileDropdownMenu />
        </div>
      </div>
    </header>
  );
};
