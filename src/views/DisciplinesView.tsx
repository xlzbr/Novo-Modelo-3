import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  User,
  Clock,
  MapPin,
  MoreVertical,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

export const DisciplinesView: React.FC = () => {
  const { disciplines, setActiveView } = useEdu();

  const [filterTab, setFilterTab] = useState<'Todas' | 'Em andamento' | 'Concluídas' | 'Futuras'>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Disciplines matching Screen 5 of the montage
  const disciplineList = useMemo(() => {
    return [
      {
        id: 'disc-calc1',
        name: 'Cálculo I',
        code: 'MAT-001',
        instructor: 'Prof. Maria Silva',
        schedule: 'Seg 08:00 - 10:00 • Sala 302',
        progress: 75,
        status: 'Em andamento' as const,
        statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-[#346BDB]',
      },
      {
        id: 'disc-prog',
        name: 'Programação',
        code: 'INF-001',
        instructor: 'Prof. Carlos Mendes',
        schedule: 'Ter 14:00 - 16:00 • Lab 1',
        progress: 90,
        status: 'Em andamento' as const,
        statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-[#346BDB]',
      },
      {
        id: 'disc-fis',
        name: 'Física Geral',
        code: 'FIS-102',
        instructor: 'Prof. Ana Costa',
        schedule: 'Qua 16:00 - 18:00 • Sala 305',
        progress: 30,
        status: 'Em andamento' as const,
        statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-[#346BDB]',
      },
      {
        id: 'disc-ext',
        name: 'Projeto de Extensão',
        code: 'EXT-301',
        instructor: 'Prof. Rafael Alves',
        schedule: 'Sex 10:00 - 12:00 • Sala 201',
        progress: 20,
        status: 'Em andamento' as const,
        statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        barColor: 'bg-[#346BDB]',
      },
      {
        id: 'disc-etica',
        name: 'Ética e Cidadania',
        code: 'HUM-150',
        instructor: 'Prof. Fernanda Lima',
        schedule: 'Qui 14:00 - 16:00 • Sala 202',
        progress: 100,
        status: 'Concluída' as const,
        statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
        barColor: 'bg-[#149B78]',
      },
      {
        id: 'disc-ing',
        name: 'Inglês Instrumental',
        code: 'ING-101',
        instructor: 'Prof. Lucas Martins',
        schedule: 'Seg 18:00 - 20:00 • Sala 206',
        progress: 0,
        status: 'Futura' as const,
        statusColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        barColor: 'bg-slate-300 dark:bg-slate-700',
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    return disciplineList.filter((d) => {
      const matchFilter = filterTab === 'Todas' ? true : d.status === filterTab;
      const matchQuery =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [disciplineList, filterTab, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header: 5. Minhas Disciplinas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            5. Minhas Disciplinas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe o andamento acadêmico, horários e docentes das suas matérias matriculadas.
          </p>
        </div>
      </div>

      {/* 2. Filtros por Abas e Campo de Busca (Exatamente como Tela 5) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Abas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['Todas', 'Em andamento', 'Concluídas', 'Futuras'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-[#346BDB] text-white shadow-xs'
                  : 'bg-white dark:bg-[#14223D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E1E8F1] dark:border-[#344563]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar disciplina..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E1E8F1] dark:border-[#344563] bg-white dark:bg-[#14223D] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] shadow-xs"
          />
        </div>
      </div>

      {/* 3. Grid de Cards das 6 Disciplinas (Exatamente como Tela 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((disc) => (
          <div
            key={disc.id}
            className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Topo do Card: Código e Menu */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-[#346BDB] dark:text-blue-300">
                  {disc.code}
                </span>
                <button
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                  aria-label="Mais opções"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Título e Professor */}
              <h3 className="text-base font-bold text-[#203A65] dark:text-white group-hover:text-[#346BDB] transition-colors">
                {disc.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {disc.instructor}
              </p>

              {/* Horário e Sala */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {disc.schedule}
              </p>

              {/* Barra de Progresso */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Progresso das aulas
                  </span>
                  <span className="font-bold text-[#203A65] dark:text-white font-mono">
                    {disc.progress}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${disc.barColor}`}
                    style={{ width: `${disc.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${disc.statusColor}`}>
                {disc.status}
              </span>

              <button
                onClick={() => setActiveView('schedule')}
                className="text-xs font-semibold text-[#346BDB] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Detalhes
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
