import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Filter,
  User,
  X,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

export const CalendarView: React.FC = () => {
  const { disciplines, addEvent } = useEdu();

  // Selected tab from Screen 3
  const [activeTab, setActiveTab] = useState<'Calendário' | 'Horários' | 'Grade de horários' | 'Eventos'>('Calendário');
  const [selectedDay, setSelectedDay] = useState<number>(22);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    aulas: true,
    provas: true,
    entregas: true,
    eventos: true,
    pessoais: true,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      aulas: true,
      provas: true,
      entregas: true,
      eventos: true,
      pessoais: true,
    });
  };

  // Calendar days for Abril 2025
  const monthDays = [
    { num: 30, isCurrentMonth: false },
    { num: 31, isCurrentMonth: false },
    { num: 1, isCurrentMonth: true, hasEvent: true },
    { num: 2, isCurrentMonth: true },
    { num: 3, isCurrentMonth: true, hasEvent: true },
    { num: 4, isCurrentMonth: true },
    { num: 5, isCurrentMonth: true },
    { num: 6, isCurrentMonth: true },
    { num: 7, isCurrentMonth: true, hasEvent: true },
    { num: 8, isCurrentMonth: true },
    { num: 9, isCurrentMonth: true },
    { num: 10, isCurrentMonth: true, hasEvent: true },
    { num: 11, isCurrentMonth: true },
    { num: 12, isCurrentMonth: true },
    { num: 13, isCurrentMonth: true },
    { num: 14, isCurrentMonth: true, hasEvent: true },
    { num: 15, isCurrentMonth: true },
    { num: 16, isCurrentMonth: true, hasEvent: true },
    { num: 17, isCurrentMonth: true },
    { num: 18, isCurrentMonth: true },
    { num: 19, isCurrentMonth: true },
    { num: 20, isCurrentMonth: true },
    { num: 21, isCurrentMonth: true },
    { num: 22, isCurrentMonth: true, hasEvent: true, isSelected: true },
    { num: 23, isCurrentMonth: true, hasEvent: true },
    { num: 24, isCurrentMonth: true, hasEvent: true },
    { num: 25, isCurrentMonth: true, hasEvent: true },
    { num: 26, isCurrentMonth: true },
    { num: 27, isCurrentMonth: true },
    { num: 28, isCurrentMonth: true, hasEvent: true },
    { num: 29, isCurrentMonth: true },
    { num: 30, isCurrentMonth: true },
    { num: 1, isCurrentMonth: false },
    { num: 2, isCurrentMonth: false },
    { num: 3, isCurrentMonth: false },
  ];

  // Commitments for Day 22 (Screen 3)
  const commitmentsDay22 = [
    {
      id: 'c-1',
      time: '08:00',
      title: 'Cálculo I',
      details: 'Aula • Sala 302',
      type: 'Aula',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      category: 'aulas',
    },
    {
      id: 'c-2',
      time: '10:00',
      title: 'Programação',
      details: 'Aula • Laboratório',
      type: 'Aula',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      category: 'aulas',
    },
    {
      id: 'c-3',
      time: '14:00',
      title: 'Física Geral',
      details: 'Prova • Sala 305',
      type: 'Prova',
      badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      category: 'provas',
    },
  ];

  const visibleCommitments = commitmentsDay22.filter((c) => filters[c.category as keyof typeof filters]);

  // Weekly Grid Data for "Grade de horários"
  const weeklySchedule = [
    { time: '08:00 - 10:00', seg: 'Cálculo I (Sala 302)', ter: '—', qua: '—', qui: '—', sex: '—' },
    { time: '10:00 - 12:00', seg: '—', ter: '—', qua: '—', qui: '—', sex: 'Projeto de Extensão (Sala 201)' },
    { time: '14:00 - 16:00', seg: '—', ter: 'Programação (Lab 1)', qua: '—', qui: 'Ética e Cidadania (Sala 202)', sex: '—' },
    { time: '16:00 - 18:00', seg: '—', ter: '—', qua: 'Física Geral (Sala 305)', qui: '—', sex: '—' },
    { time: '18:00 - 20:00', seg: 'Inglês Instrumental (Sala 206)', ter: '—', qua: '—', qui: '—', sex: '—' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Top Title: 3. Horários e Calendários */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            3. Horários e Calendários
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Planejamento acadêmico, datas de avaliações e grade horária de aulas.
          </p>
        </div>
      </div>

      {/* 2. Top Tabs: [Calendário] [Horários] [Grade de horários] [Eventos] */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        {(['Calendário', 'Horários', 'Grade de horários', 'Eventos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#346BDB] text-white shadow-xs'
                : 'bg-white dark:bg-[#14223D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E1E8F1] dark:border-[#344563]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Main Content based on active tab */}
      {activeTab === 'Calendário' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Calendário + Compromissos do Dia (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Grade do Mês */}
            <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-base font-bold text-[#203A65] dark:text-white">
                  Abril 2025
                </span>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                <span>D</span>
                <span>S</span>
                <span>T</span>
                <span>Q</span>
                <span>Q</span>
                <span>S</span>
                <span>S</span>
              </div>

              {/* Células do mês */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => d.isCurrentMonth && setSelectedDay(d.num)}
                    className={`h-11 sm:h-12 rounded-lg flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      d.num === selectedDay && d.isCurrentMonth
                        ? 'bg-[#346BDB] text-white font-bold shadow-sm'
                        : d.isCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800'
                        : 'text-slate-300 dark:text-slate-600 opacity-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{d.num}</span>
                    {d.hasEvent && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          d.num === selectedDay && d.isCurrentMonth ? 'bg-white' : 'bg-[#346BDB]'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Compromissos do Dia */}
            <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs">
              <h2 className="text-base font-bold text-[#203A65] dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                Compromissos do dia {selectedDay} de Abril
              </h2>

              <div className="space-y-3">
                {visibleCommitments.length > 0 ? (
                  visibleCommitments.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 w-12">
                          {c.time}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-[#203A65] dark:text-white">
                            {c.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {c.details}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${c.badgeClass}`}>
                        {c.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                    Nenhum compromisso para os filtros selecionados.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Filtros e Botão Novo Evento (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-[#203A65] dark:text-white">Filtros</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#346BDB] hover:underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filters.aulas}
                    onChange={() => toggleFilter('aulas')}
                    className="w-4 h-4 rounded text-[#346BDB] accent-[#346BDB]"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#346BDB]" />
                  <span>Aulas</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filters.provas}
                    onChange={() => toggleFilter('provas')}
                    className="w-4 h-4 rounded text-[#E84B58] accent-[#E84B58]"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E84B58]" />
                  <span>Provas</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filters.entregas}
                    onChange={() => toggleFilter('entregas')}
                    className="w-4 h-4 rounded text-[#E99A28] accent-[#E99A28]"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E99A28]" />
                  <span>Entregas</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filters.eventos}
                    onChange={() => toggleFilter('eventos')}
                    className="w-4 h-4 rounded text-[#8B5CF6] accent-[#8B5CF6]"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span>Eventos</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filters.pessoais}
                    onChange={() => toggleFilter('pessoais')}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Pessoais</span>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Novo evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade de Horários Tab */}
      {activeTab === 'Grade de horários' && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Horário</th>
                <th className="py-3 px-4 font-semibold">Segunda-feira</th>
                <th className="py-3 px-4 font-semibold">Terça-feira</th>
                <th className="py-3 px-4 font-semibold">Quarta-feira</th>
                <th className="py-3 px-4 font-semibold">Quinta-feira</th>
                <th className="py-3 px-4 font-semibold">Sexta-feira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {weeklySchedule.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                    {row.time}
                  </td>
                  <td className="py-3.5 px-4 text-[#203A65] dark:text-white font-medium">{row.seg}</td>
                  <td className="py-3.5 px-4 text-[#203A65] dark:text-white font-medium">{row.ter}</td>
                  <td className="py-3.5 px-4 text-[#203A65] dark:text-white font-medium">{row.qua}</td>
                  <td className="py-3.5 px-4 text-[#203A65] dark:text-white font-medium">{row.qui}</td>
                  <td className="py-3.5 px-4 text-[#203A65] dark:text-white font-medium">{row.sex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Horários Tab */}
      {activeTab === 'Horários' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {disciplines.map((d) => (
            <div
              key={d.id}
              className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs space-y-2"
            >
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {d.code}
              </span>
              <h3 className="text-base font-bold text-[#203A65] dark:text-white">{d.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prof. {d.instructor?.name || 'Docente responsável'}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span>
                  {d.weeklySchedule && d.weeklySchedule.length > 0
                    ? `${d.weeklySchedule[0].dayOfWeek} ${d.weeklySchedule[0].time} • ${d.room || 'Campus'}`
                    : 'Horário a confirmar'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eventos Tab */}
      {activeTab === 'Eventos' && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#203A65] dark:text-white">Próximos Eventos Institucionais</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40">
              <span className="text-xs font-bold text-[#346BDB]">24/04/2025</span>
              <h3 className="text-sm font-bold text-[#203A65] dark:text-white mt-1">
                Semana de Tecnologia e Inovação Folium
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Palestras com engenheiros da indústria, workshops de Inteligência Artificial e feira de projetos.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/40">
              <span className="text-xs font-bold text-[#8B5CF6]">05/05/2025</span>
              <h3 className="text-sm font-bold text-[#203A65] dark:text-white mt-1">
                Hackathon Acadêmico de Computação
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Maratona de 24 horas para desenvolvimento de soluções com impacto social.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
