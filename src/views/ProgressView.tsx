import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

export const ProgressView: React.FC = () => {
  const { preferences, setActiveView } = useEdu();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header: 6. Progresso Acadêmico */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            6. Progresso Acadêmico
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhamento curricular, integralização de carga horária e coeficiente de rendimento (CR).
          </p>
        </div>
      </div>

      {/* 2. Primeira Linha de Métricas (Exatamente como Tela 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Gauge de Conclusão Geral */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#346BDB]"
                strokeDasharray="68, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold text-[#203A65] dark:text-white font-mono">
              68%
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Conclusão geral
            </span>
            <p className="text-sm font-bold text-[#203A65] dark:text-white mt-0.5">
              Curso de Ciência da Computação
            </p>
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Concluídas
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#149B78] font-mono">5</span>
            <span className="text-xs text-slate-500">disciplinas</span>
          </div>
          <div className="mt-2 text-[11px] text-[#149B78] font-medium">100% aprovado</div>
        </div>

        {/* Em andamento */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Em andamento
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#346BDB] font-mono">3</span>
            <span className="text-xs text-slate-500">disciplinas</span>
          </div>
          <div className="mt-2 text-[11px] text-[#346BDB] font-medium">Semestre atual (4º)</div>
        </div>

        {/* Pendentes */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Pendentes
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#E84B58] font-mono">4</span>
            <span className="text-xs text-slate-500">disciplinas</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium">Próximos semestres</div>
        </div>
      </div>

      {/* 3. Segunda Linha: Horas Cursadas, Média Acadêmica e Trilha Acadêmica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Horas Cursadas */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#346BDB]" />
                Horas cursadas
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">66.7%</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-[#203A65] dark:text-white font-mono">
              480h <span className="text-sm font-normal text-slate-400">/ 720h</span>
            </div>
          </div>
          <div className="mt-4 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-[#346BDB]" style={{ width: '66.7%' }} />
          </div>
        </div>

        {/* Média Acadêmica (CR) */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Média acadêmica
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-medium">
              Excelente
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold text-[#203A65] dark:text-white font-mono">
            8,2
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Coeficiente de Rendimento Acumulado (CR)
          </p>
        </div>

        {/* Trilha Acadêmica */}
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Trilha acadêmica
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">1º Semestre 2024</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#149B78]">
                Concluída
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">2º Semestre 2024</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#149B78]">
                Concluída
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">1º Semestre 2025</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#346BDB]">
                Em andamento
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-medium">2º Semestre 2025</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Terceira Linha: Gráfico de Evolução, Donut de Status e Próximas Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Evolução do Progresso (Gráfico SVG) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#203A65] dark:text-white mb-1">
              Evolução do progresso
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Acompanhamento mensal da conclusão de atividades
            </p>

            {/* SVG Chart */}
            <div className="h-40 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />

                {/* Smooth Curve */}
                <path
                  d="M 10 95 Q 50 85 90 70 T 170 50 T 250 35 T 290 25"
                  fill="none"
                  stroke="#346BDB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Points */}
                <circle cx="10" cy="95" r="3.5" fill="#346BDB" />
                <circle cx="50" cy="85" r="3.5" fill="#346BDB" />
                <circle cx="90" cy="70" r="3.5" fill="#346BDB" />
                <circle cx="130" cy="60" r="3.5" fill="#346BDB" />
                <circle cx="170" cy="50" r="3.5" fill="#346BDB" />
                <circle cx="210" cy="42" r="3.5" fill="#346BDB" />
                <circle cx="250" cy="35" r="3.5" fill="#346BDB" />
                <circle cx="290" cy="25" r="4" fill="#203A65" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Ago</span>
              <span>Set</span>
            </div>
          </div>
        </div>

        {/* Disciplinas por Status (Donut) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#203A65] dark:text-white mb-1">
              Disciplinas por status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Distribuição proporcional da grade
            </p>

            <div className="flex items-center gap-4 my-2">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Concluídas: 5/12 = 41.6% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#149B78"
                    strokeWidth="4"
                    strokeDasharray="42, 58"
                    strokeDashoffset="0"
                  />
                  {/* Em andamento: 3/12 = 25% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#346BDB"
                    strokeWidth="4"
                    strokeDasharray="25, 75"
                    strokeDashoffset="-42"
                  />
                  {/* Pendentes: 4/12 = 33.3% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#E84B58"
                    strokeWidth="4"
                    strokeDasharray="33, 67"
                    strokeDashoffset="-67"
                  />
                </svg>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#149B78]" />
                  <span className="text-slate-700 dark:text-slate-300">Concluídas: 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#346BDB]" />
                  <span className="text-slate-700 dark:text-slate-300">Em andamento: 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E84B58]" />
                  <span className="text-slate-700 dark:text-slate-300">Pendentes: 4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              onClick={() => setActiveView('disciplines')}
              className="text-xs font-semibold text-[#346BDB] dark:text-blue-400 hover:underline"
            >
              Ver todas as disciplinas &rarr;
            </button>
          </div>
        </div>

        {/* Próximas Atividades */}
        <div className="lg:col-span-3 bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#203A65] dark:text-white mb-1">
              Próximas atividades
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Prazos de avaliação
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40">
                <span className="w-2 h-2 rounded-full bg-[#E99A28] mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-white">
                    Programação
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Entrega • 14/04
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                <span className="w-2 h-2 rounded-full bg-[#E84B58] mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#203A65] dark:text-white">
                    Física Geral
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Prova • 16/04
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveView('calendar')}
              className="w-full py-2 bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer text-center"
            >
              Ver detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
