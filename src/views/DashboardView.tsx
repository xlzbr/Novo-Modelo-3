import React from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Bell,
  CheckSquare,
  FileCheck,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { Task } from '../types';

interface DashboardViewProps {
  onOpenTaskDetail?: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenTaskDetail }) => {
  const {
    preferences,
    setActiveView,
    navigateToCampusMap,
    tasks,
    notices,
    disciplines,
  } = useEdu();

  const studentName = preferences.shortName || 'Lucas';
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ========================================================================= */}
      {/* 1. HERO CAMPUS BANNER (Quarta-feira, 21 de maio / Olá, Lucas!) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl min-h-[160px] sm:min-h-[180px] p-6 sm:p-8 flex flex-col justify-between text-white shadow-lg border border-slate-200/20">
        {/* Foto de fundo do campus universitário */}
        <img
          src="/campus_hero.jpg"
          alt="Campus Universitário Folium"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
        {/* Overlay gradiente para excelente contraste visual e legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1729]/95 via-[#13243F]/85 to-[#1E3A65]/70 backdrop-blur-[1px]" />

        {/* Topo do Banner: Data */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            Quarta-feira, 21 de maio de 2025
          </span>
          <div className="hidden lg:block">
            <span className="text-xs italic text-slate-300 font-serif">
              "Disciplina hoje, conquistas amanhã."
            </span>
          </div>
        </div>

        {/* Mensagem Principal */}
        <div className="relative z-10 mt-3 sm:mt-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Olá, {studentName}!</span>
            <span className="text-2xl sm:text-3xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/90 mt-1.5 max-w-2xl leading-relaxed">
            Aqui está o resumo da sua jornada acadêmica. Continue com dedicação e disciplina!
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LINHA 1: PRÓXIMA AULA + OUTRAS AULAS DE HOJE + RESUMO HOJE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: Próxima Aula (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                PRÓXIMA AULA
              </span>
              <span className="bg-[#346BDB] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Em 1h 32min
              </span>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-2 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-[#203A65] dark:text-[#F8FAFC] leading-snug">
                  Programação Orientada a Objetos
                </h3>

                <div className="space-y-1.5 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#346BDB]" />
                    <span>08:00 – 10:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#346BDB]" />
                    <span>Prof. Mariana Costa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#346BDB]" />
                    <span className="font-medium text-[#203A65] dark:text-white">
                      Bloco A – 2º andar – Sala 204
                    </span>
                  </div>
                </div>
              </div>

              {/* Miniatura do prédio com botão Localizar Sala */}
              <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 group">
                <img
                  src="/campus_hero.jpg"
                  alt="Bloco A"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#102038]/60 flex items-center justify-center p-2">
                  <button
                    onClick={() =>
                      navigateToCampusMap({ buildingId: 'bloco-a', room: 'Sala 204' })
                    }
                    className="w-full py-1.5 px-2 bg-[#203A65] hover:bg-[#162742] text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#93C5FD]" />
                    <span>Localizar sala</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('campus-map')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver mapa do campus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: Outras aulas de hoje (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
              <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
                Outras aulas de hoje
              </h3>
              <button
                onClick={() => setActiveView('schedule')}
                className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#346BDB] mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      10:00 – 12:00
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      Sala 302 – Bloco B
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                    Banco de Dados
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#346BDB] mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      14:00 – 16:00
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      Sala 105 – Bloco C
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                    Estatística
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#346BDB] mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                      19:00 – 21:00
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      Biblioteca
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                    Estudo Dirigido
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('schedule')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver grade completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: Hoje (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
              <Calendar className="w-4 h-4 text-[#346BDB]" />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
                  Hoje
                </h3>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  21 de maio de 2025
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                  Aulas
                </span>
                <span className="text-sm font-extrabold text-[#203A65] dark:text-white">
                  2
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                  Avaliações
                </span>
                <span className="text-sm font-extrabold text-[#203A65] dark:text-white">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                  Compromissos
                </span>
                <span className="text-sm font-extrabold text-[#203A65] dark:text-white">
                  1
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('schedule')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer w-full justify-between"
            >
              <span>Ver agenda completa</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LINHA 2: 4 CARTÕES DE AÇÃO RÁPIDA (Tarefas, Calendário, Disciplinas, Notif) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tarefas pendentes */}
        <div
          onClick={() => setActiveView('tasks')}
          className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-4.5 shadow-2xs hover:shadow-md hover:border-[#346BDB]/50 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] dark:bg-[#1C3359] flex items-center justify-center text-[#346BDB] dark:text-[#93C5FD] shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                Tarefas pendentes
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                {pendingTasksCount || 3} atividades aguardando entrega
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#346BDB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 2: Acessar calendário */}
        <div
          onClick={() => setActiveView('calendar')}
          className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-4.5 shadow-2xs hover:shadow-md hover:border-[#346BDB]/50 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] dark:bg-[#1C3359] flex items-center justify-center text-[#346BDB] dark:text-[#93C5FD] shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                Acessar calendário
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                Veja todos os seus compromissos
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#346BDB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 3: Ver disciplinas */}
        <div
          onClick={() => setActiveView('disciplines')}
          className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-4.5 shadow-2xs hover:shadow-md hover:border-[#346BDB]/50 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] dark:bg-[#1C3359] flex items-center justify-center text-[#346BDB] dark:text-[#93C5FD] shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                Ver disciplinas
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                Acesse suas matérias
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#346BDB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>

        {/* Card 4: Notificações */}
        <div
          onClick={() => setActiveView('notices')}
          className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-4.5 shadow-2xs hover:shadow-md hover:border-[#346BDB]/50 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] dark:bg-[#1C3359] flex items-center justify-center text-[#346BDB] dark:text-[#93C5FD] shrink-0 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate">
                Notificações
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                4 não lidas
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#346BDB] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LINHA 3: PRÓXIMAS ATIVIDADES + SEU PROGRESSO ACADÊMICO + NOTIFICAÇÕES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {/* CARD A: Próximas Atividades */}
        <div className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#346BDB]" />
                <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
                  Próximas atividades
                </h3>
              </div>
              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              {/* Item 1: Urgente */}
              <div
                onClick={() => setActiveView('tasks')}
                className="p-2.5 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1.5 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                    Atividade de Programação
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                    Entregar até 23/05 - 23:59
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                  Urgente
                </span>
              </div>

              {/* Item 2: Em breve */}
              <div
                onClick={() => setActiveView('tasks')}
                className="p-2.5 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1.5 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                    Estudo Dirigido
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                    Entrega até 27/05 - 14:00
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  Em breve
                </span>
              </div>

              {/* Item 3: Normal */}
              <div
                onClick={() => setActiveView('tasks')}
                className="p-2.5 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1.5 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                    Reunião de Grupo
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] truncate mt-0.5">
                    Hoje - 20:00
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                  Normal
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('tasks')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar tarefas acadêmicas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD B: Seu Progresso Acadêmico (Gauge 68% + 4 métricas) */}
        <div className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#346BDB]" />
                <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
                  Seu progresso acadêmico
                </h3>
              </div>
              <button
                onClick={() => setActiveView('progress')}
                className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver detalhes</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Gauge Circular e Subtítulo */}
            <div className="mt-3.5 flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#EFF4FA] dark:stroke-[#1C3359]"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#346BDB]"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - 0.68)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-lg font-black text-[#203A65] dark:text-white">
                  68%
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-[#203A65] dark:text-slate-200">
                  das atividades entregues
                </span>
                <div className="w-full bg-[#EFF4FA] dark:bg-[#1C3359] h-2 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#346BDB] h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            {/* 4 Caixas de Estatísticas */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="bg-[#F7F9FC] dark:bg-[#1A2C4E]/60 p-2 rounded-xl">
                <span className="text-sm font-extrabold text-[#203A65] dark:text-white block">
                  12
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">
                  Total
                </span>
              </div>

              <div className="bg-[#F7F9FC] dark:bg-[#1A2C4E]/60 p-2 rounded-xl">
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  8
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">
                  Entregues
                </span>
              </div>

              <div className="bg-[#F7F9FC] dark:bg-[#1A2C4E]/60 p-2 rounded-xl">
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 block">
                  3
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">
                  Pendentes
                </span>
              </div>

              <div className="bg-[#F7F9FC] dark:bg-[#1A2C4E]/60 p-2 rounded-xl">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 block">
                  1
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">
                  Atrasadas
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('progress')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver relatório completo de metas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD C: Notificações */}
        <div className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-[#346BDB]" />
                <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
                  Notificações
                </h3>
                <span className="w-4 h-4 rounded-full bg-[#E84B58] text-white text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <button
                onClick={() => setActiveView('notices')}
                className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3.5 space-y-3">
              {/* Notificação 1 */}
              <div
                onClick={() => setActiveView('notices')}
                className="p-2 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                      Mudança de sala – Introdução à Programação
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Aula de hoje será no Bloco A, sala 204.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Hoje, 08:12
                    </span>
                  </div>
                </div>
              </div>

              {/* Notificação 2 */}
              <div
                onClick={() => setActiveView('notices')}
                className="p-2 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                      Novo material disponível
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Foi disponibilizado o material da semana 5.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Ontem, 16:45
                    </span>
                  </div>
                </div>
              </div>

              {/* Notificação 3 */}
              <div
                onClick={() => setActiveView('notices')}
                className="p-2 rounded-xl hover:bg-[#F7F9FC] dark:hover:bg-[#1A2C4E]/50 -mx-1 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] group-hover:text-[#346BDB] truncate">
                      Prazo de atividade atualizado
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      O prazo da atividade de Banco de Dados foi alterado.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      19/05, 09:17
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E1E8F1] dark:border-[#344563]">
            <button
              onClick={() => setActiveView('notices')}
              className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Central de avisos e comunicados</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. LINHA 4: SUAS DISCIPLINAS (POO, BD, EST, ML) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#14223D] rounded-2xl border border-[#E1E8F1] dark:border-[#344563] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E8F1] dark:border-[#344563]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#346BDB]" />
            <h3 className="text-sm font-bold text-[#203A65] dark:text-[#F8FAFC]">
              Suas disciplinas
            </h3>
          </div>
          <button
            onClick={() => setActiveView('disciplines')}
            className="text-xs font-semibold text-[#346BDB] dark:text-[#93C5FD] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Ver todas</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
          {/* Disciplina 1: POO */}
          <div
            onClick={() => setActiveView('disciplines')}
            className="p-3.5 rounded-xl border border-[#E1E8F1] dark:border-[#344563] hover:border-[#346BDB] dark:hover:border-[#60A5FA] bg-[#F7F9FC] dark:bg-[#1A2C4E]/50 hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#203A65] text-white text-xs font-bold flex items-center justify-center shrink-0">
                POO
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate group-hover:text-[#346BDB]">
                  Prog. Orientada a Objetos
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  4 atividades • 1 avaliação
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#346BDB] shrink-0 ml-1" />
          </div>

          {/* Disciplina 2: BD */}
          <div
            onClick={() => setActiveView('disciplines')}
            className="p-3.5 rounded-xl border border-[#E1E8F1] dark:border-[#344563] hover:border-[#346BDB] dark:hover:border-[#60A5FA] bg-[#F7F9FC] dark:bg-[#1A2C4E]/50 hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#346BDB] text-white text-xs font-bold flex items-center justify-center shrink-0">
                BD
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate group-hover:text-[#346BDB]">
                  Banco de Dados
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  3 atividades • 1 avaliação
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#346BDB] shrink-0 ml-1" />
          </div>

          {/* Disciplina 3: EST */}
          <div
            onClick={() => setActiveView('disciplines')}
            className="p-3.5 rounded-xl border border-[#E1E8F1] dark:border-[#344563] hover:border-[#346BDB] dark:hover:border-[#60A5FA] bg-[#F7F9FC] dark:bg-[#1A2C4E]/50 hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#149B78] text-white text-xs font-bold flex items-center justify-center shrink-0">
                EST
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate group-hover:text-[#346BDB]">
                  Estatística
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  2 atividades • 1 avaliação
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#346BDB] shrink-0 ml-1" />
          </div>

          {/* Disciplina 4: ML */}
          <div
            onClick={() => setActiveView('disciplines')}
            className="p-3.5 rounded-xl border border-[#E1E8F1] dark:border-[#344563] hover:border-[#346BDB] dark:hover:border-[#60A5FA] bg-[#F7F9FC] dark:bg-[#1A2C4E]/50 hover:bg-[#EFF4FA] dark:hover:bg-[#1C3359] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center shrink-0">
                ML
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#203A65] dark:text-[#F8FAFC] truncate group-hover:text-[#346BDB]">
                  Machine Learning
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  1 atividade • 1 avaliação
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#346BDB] shrink-0 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
