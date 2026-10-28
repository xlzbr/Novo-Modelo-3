import React, { useState, useMemo } from 'react';
import {
  Bell,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  MessageSquare,
  CheckCheck,
  Check,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

export const NoticesView: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    toggleNotificationRead,
    markAllNotificationsAsRead,
  } = useEdu();

  const [activeTab, setActiveTab] = useState<'Todas' | 'Não lidas (3)' | 'Acadêmicas' | 'Provas e entregas' | 'Institucionais'>('Todas');

  // 5 Notifications from Screen 7
  const officialNotices = useMemo(() => {
    return [
      {
        id: 'notif-1',
        title: 'Nova aula disponível',
        message: 'A aula de Programação foi remarcada para o dia 23/04 às 14:00.',
        category: 'Acadêmica',
        categoryTag: 'Acadêmica',
        categoryColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        icon: BookOpen,
        iconBg: 'bg-blue-50 text-[#346BDB] dark:bg-blue-900/30',
        read: true,
        type: 'academic',
      },
      {
        id: 'notif-2',
        title: 'Prova de Cálculo I',
        message: 'A prova será realizada no dia 25/04, conforme cronograma.',
        category: 'Provas e entregas',
        categoryTag: 'Prova',
        categoryColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        icon: FileText,
        iconBg: 'bg-red-50 text-[#E84B58] dark:bg-red-900/30',
        read: false,
        type: 'exam',
      },
      {
        id: 'notif-3',
        title: 'Entrega de Programação',
        message: 'Lembrete: entrega da atividade até 24/04, 23:59.',
        category: 'Provas e entregas',
        categoryTag: 'Entrega',
        categoryColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
        icon: Clock,
        iconBg: 'bg-orange-50 text-[#E99A28] dark:bg-orange-900/30',
        read: false,
        type: 'assignment',
      },
      {
        id: 'notif-4',
        title: 'Evento da faculdade',
        message: 'Semana de Tecnologia e Inovação começa amanhã.',
        category: 'Institucionais',
        categoryTag: 'Evento',
        categoryColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
        icon: Sparkles,
        iconBg: 'bg-purple-50 text-[#8B5CF6] dark:bg-purple-900/30',
        read: true,
        type: 'event',
      },
      {
        id: 'notif-5',
        title: 'Nova mensagem',
        message: 'Você recebeu uma nova mensagem do professor.',
        category: 'Acadêmica',
        categoryTag: 'Geral',
        categoryColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        icon: MessageSquare,
        iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
        read: true,
        type: 'message',
      },
    ];
  }, []);

  // Filter logic
  const filteredNotices = useMemo(() => {
    return officialNotices.filter((n) => {
      // Check if user toggled in EduContext
      const isReadInContext = notifications.find((x) => x.id === n.id)?.read ?? n.read;
      if (activeTab === 'Não lidas (3)') return !isReadInContext;
      if (activeTab === 'Acadêmicas') return n.category === 'Acadêmica';
      if (activeTab === 'Provas e entregas') return n.category === 'Provas e entregas';
      if (activeTab === 'Institucionais') return n.category === 'Institucionais';
      return true;
    });
  }, [officialNotices, activeTab, notifications]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header: 7. Notificações e Avisos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            7. Notificações e Avisos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comunicados acadêmicos oficiais, alertas de provas, prazos de entrega e avisos da coordenação.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E1E8F1] dark:border-[#344563] bg-white dark:bg-[#14223D] text-xs font-semibold text-[#203A65] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-[#346BDB]" />
          Marcar todas como lidas
        </button>
      </div>

      {/* 2. Filtros por Abas (Exatamente como Tela 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['Todas', 'Não lidas (3)', 'Acadêmicas', 'Provas e entregas', 'Institucionais'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#346BDB] text-white shadow-xs'
                : 'bg-white dark:bg-[#14223D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E1E8F1] dark:border-[#344563]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Lista dos 5 Cards de Notificação (Exatamente como Tela 7) */}
      <div className="space-y-3">
        {filteredNotices.map((notice) => {
          const isRead = notifications.find((x) => x.id === notice.id)?.read ?? notice.read;
          const Icon = notice.icon;

          return (
            <div
              key={notice.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                !isRead
                  ? 'bg-white dark:bg-[#14223D] border-blue-200 dark:border-blue-800/80 ring-1 ring-blue-500/10'
                  : 'bg-white/80 dark:bg-[#14223D]/80 border-[#E1E8F1] dark:border-[#344563]'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                {/* Ícone Redondo */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notice.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Conteúdo */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#203A65] dark:text-white truncate">
                      {notice.title}
                    </h3>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {notice.message}
                  </p>
                </div>
              </div>

              {/* Badges de Categoria e Status (Direita) */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold ${notice.categoryColor}`}
                >
                  {notice.categoryTag}
                </span>

                <button
                  onClick={() => toggleNotificationRead(notice.id)}
                  className={`text-xs px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    !isRead
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {!isRead ? 'Não lida' : 'Lida'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
