import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
  X,
  Check,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { ScheduleEvent } from '../types';

export const ScheduleView: React.FC = () => {
  const { events, addEvent } = useEdu();

  // Navigation date
  const [selectedDateStr, setSelectedDateStr] = useState('2025-04-22');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Aula' | 'Prova' | 'Entrega' | 'Evento' | 'Pessoal'>('Aula');
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newLocation, setNewLocation] = useState('Sala 302');
  const [newInstructor, setNewInstructor] = useState('Prof. Maria Silva');

  // Daily events from Screen 2
  const scheduleEvents = [
    {
      id: 'sch-1',
      timeSlot: '08:00 - 10:00',
      title: 'Cálculo I',
      instructor: 'Prof. Maria Silva',
      location: 'Sala 302',
      type: 'Aula',
      badgeColor: 'bg-[#346BDB] text-white',
      borderColor: 'border-[#346BDB]',
      dotColor: 'bg-[#346BDB]',
    },
    {
      id: 'sch-2',
      timeSlot: '10:00 - 12:00',
      title: 'Programação',
      instructor: 'Prof. Carlos Mendes',
      location: 'Laboratório de Informática',
      type: 'Aula',
      badgeColor: 'bg-[#346BDB] text-white',
      borderColor: 'border-[#346BDB]',
      dotColor: 'bg-[#346BDB]',
    },
    {
      id: 'sch-3',
      timeSlot: '12:00 - 13:00',
      title: 'Almoço',
      instructor: 'Restaurante Universitário',
      location: 'Pátio Central',
      type: 'Pessoal',
      badgeColor: 'bg-slate-500 text-white',
      borderColor: 'border-slate-400',
      dotColor: 'bg-slate-400',
    },
    {
      id: 'sch-4',
      timeSlot: '14:00 - 16:00',
      title: 'Programação',
      instructor: 'Prof. Carlos Mendes',
      location: 'Sala 201',
      type: 'Entrega',
      badgeColor: 'bg-[#E99A28] text-white',
      borderColor: 'border-[#E99A28]',
      dotColor: 'bg-[#E99A28]',
    },
    {
      id: 'sch-5',
      timeSlot: '16:00 - 18:00',
      title: 'Física Geral',
      instructor: 'Prof. Ana Costa',
      location: 'Sala 305',
      type: 'Prova',
      badgeColor: 'bg-[#E84B58] text-white',
      borderColor: 'border-[#E84B58]',
      dotColor: 'bg-[#E84B58]',
    },
    {
      id: 'sch-6',
      timeSlot: '19:00 - 21:00',
      title: 'Projeto de Extensão',
      instructor: 'Reunião',
      location: 'Sala 201',
      type: 'Evento',
      badgeColor: 'bg-[#8B5CF6] text-white',
      borderColor: 'border-[#8B5CF6]',
      dotColor: 'bg-[#8B5CF6]',
    },
  ];

  // Helper date navigation
  const handlePrevDay = () => {
    const d = new Date(selectedDateStr + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDateStr + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDateStr(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDateStr('2025-04-22');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addEvent({
      taskId: 'custom-event-' + Date.now(),
      date: selectedDateStr,
      startTime: newStartTime,
      endTime: newEndTime,
      durationMinutes: 120,
      location: newLocation,
      instructor: newInstructor,
      type: newType.toLowerCase() as any,
    });

    setIsModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header: 2. Agenda Diária + Botão Novo Evento */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            2. Agenda Diária
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cronograma completo das aulas, provas, entregas e compromissos do dia.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-sm shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo evento
        </button>
      </div>

      {/* 2. Barra de Navegação de Data */}
      <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-3 sm:p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dia anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm sm:text-base font-bold text-[#203A65] dark:text-white">
            22 de Abril de 2025
          </span>
          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Próximo dia"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleToday}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#EFF4FA] dark:bg-slate-800 text-[#346BDB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Hoje
        </button>
      </div>

      {/* 3. Linha do Tempo Vertical (Exatamente como Tela 2 da montagem) */}
      <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 sm:p-8 shadow-xs relative">
        <div className="relative">
          {/* Linha vertical centralizada atrás dos nós */}
          <div className="absolute left-[110px] sm:left-[140px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Marcador "Agora 10:24" */}
          <div className="relative flex items-center my-4 ml-[70px] sm:ml-[100px] z-20">
            <div className="flex items-center gap-2 bg-[#346BDB] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Agora 10:24</span>
            </div>
            <div className="flex-1 h-0.5 bg-[#346BDB]/40 ml-2" />
          </div>

          {/* Lista de Eventos */}
          <div className="space-y-6">
            {scheduleEvents.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Coluna de Horário */}
                <div className="w-[100px] sm:w-[125px] shrink-0 text-right pr-2 pt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 font-mono">
                  {evt.timeSlot}
                </div>

                {/* Marcador na Linha */}
                <div className="relative z-10 mt-2 shrink-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${evt.dotColor} ring-4 ring-white dark:ring-[#14223D] shadow-xs`}
                  />
                </div>

                {/* Card do Evento */}
                <div className="flex-1 bg-[#F7F9FC] dark:bg-[#182642] rounded-xl border border-[#E1E8F1] dark:border-[#2D3E5E] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#346BDB]/50 transition-all shadow-2xs">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#203A65] dark:text-white">
                      {evt.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {evt.instructor}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.location}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-xs px-3 py-1 rounded-md font-semibold tracking-wide shadow-2xs ${evt.badgeColor}`}
                    >
                      {evt.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Novo Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-[#203A65] dark:text-white">
                Novo Evento na Agenda
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Título do Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Seminário de Redes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#346BDB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Início
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Término
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Aula">Aula</option>
                    <option value="Prova">Prova</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Evento">Evento</option>
                    <option value="Pessoal">Pessoal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Professor / Responsável
                </label>
                <input
                  type="text"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#346BDB] hover:bg-blue-600 text-white"
                >
                  Salvar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
