import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  MessagesSquare,
  CreditCard,
  SlidersHorizontal,
  Info,
  LogOut,
  Zap,
  X,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

interface ProfileDropdownMenuProps {
  className?: string;
}

export const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({ className = '' }) => {
  const {
    preferences,
    setActiveView,
    activeView,
    resetAllData,
    setIsCopilotOpen,
  } = useEdu();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'profile' | 'community' | 'subscription' | 'settings' | 'help' | 'signout'>('profile');

  // Modais de apoio para recursos que não possuem página dedicada separada
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fecha o menu ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (id: 'profile' | 'community' | 'subscription' | 'settings' | 'help' | 'signout') => {
    setSelectedOption(id);
    setIsOpen(false);

    switch (id) {
      case 'profile':
        setActiveView('profile');
        break;
      case 'community':
        // Destino real existente: Notificações e Comunicados da comunidade acadêmica
        setActiveView('notices');
        break;
      case 'subscription':
        // Destino real existente: Exibição do status da conta PRO acadêmica institucional
        setIsSubscriptionModalOpen(true);
        break;
      case 'settings':
        setActiveView('settings');
        break;
      case 'help':
        setIsHelpModalOpen(true);
        break;
      case 'signout':
        setIsSignOutModalOpen(true);
        break;
    }
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    resetAllData();
    setActiveView('dashboard');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* ========================================================================= */}
      {/* 1. AVATAR CIRCULAR COM CONTORNO GRADIENTE (Rosa, Lilás, Laranja, Amarelo) */}
      {/* ========================================================================= */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative group p-0.5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 transition-all duration-200 active:scale-95"
        aria-label="Abrir menu de perfil"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Contorno circular fino com gradiente multicolorido suave fiel à referência */}
        <div
          className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-full p-[2px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.35)]"
          style={{
            background:
              'linear-gradient(135deg, #FF7A00 0%, #FF2E93 45%, #A855F7 80%, #FFB800 100%)',
          }}
        >
          {/* Anel interno branco/escuro separador */}
          <div className="w-full h-full rounded-full p-[1.5px] bg-white dark:bg-[#14223D] flex items-center justify-center overflow-hidden">
            {/* Personagem mascote azul fofo estilizado da referência */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#38BDF8] to-[#1D4ED8] flex items-center justify-center relative overflow-hidden select-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Cabeça azul felpuda */}
                <circle cx="50" cy="50" r="48" fill="url(#avatar-blue-grad)" />
                <defs>
                  <radialGradient id="avatar-blue-grad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="55%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </radialGradient>
                </defs>

                {/* Olhos brancos expressivos */}
                <circle cx="43" cy="42" r="7.5" fill="#FFFFFF" />
                <circle cx="57" cy="42" r="7.5" fill="#FFFFFF" />

                {/* Pupilas escuras olhando para o lado */}
                <circle cx="45" cy="42" r="4" fill="#0F172A" />
                <circle cx="59" cy="42" r="4" fill="#0F172A" />

                {/* Brilho nos olhos */}
                <circle cx="43.5" cy="40.5" r="1.5" fill="#FFFFFF" />
                <circle cx="57.5" cy="40.5" r="1.5" fill="#FFFFFF" />

                {/* Boquinha/Língua rosa fofa no centro */}
                <ellipse cx="50" cy="54" rx="4.5" ry="3.5" fill="#F43F5E" />
                <path
                  d="M47 52 Q50 50 53 52"
                  fill="none"
                  stroke="#BE123C"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* ========================================================================= */}
      {/* 2. MENU FLUTUANTE FIEL À REFERÊNCIA (6 Opções, 2 Grupos, Borda Suave)    */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Menu de opções do usuário"
          className="absolute right-0 top-full mt-2.5 w-60 sm:w-64 bg-white dark:bg-[#14223D] text-slate-800 dark:text-slate-100 rounded-[22px] shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-[#344563] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none"
        >
          {/* GRUPO 1: 4 Primeiras Opções */}
          <div className="space-y-0.5" role="group">
            {/* 1. Perfil (com fundo cinza-claro arredondado na referência) */}
            <button
              role="menuitem"
              onClick={() => handleSelect('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'profile'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <User
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Perfil</span>
              </div>
            </button>

            {/* 2. Comunidade */}
            <button
              role="menuitem"
              onClick={() => handleSelect('community')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'community'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Ícone linear de conversação / comunidade */}
                <MessagesSquare
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Comunidade</span>
              </div>
            </button>

            {/* 3. Assinatura com Etiqueta Rosa "⚡ PRO" à direita */}
            <button
              role="menuitem"
              onClick={() => handleSelect('subscription')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'subscription'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <CreditCard
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Assinatura</span>
              </div>

              {/* Etiqueta PRO rosa fiel à referência */}
              <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-[#FCE7F3] text-[#9333EA] dark:bg-pink-950/60 dark:text-pink-300 shrink-0">
                <Zap className="w-2.5 h-2.5 fill-current" />
                <span>PRO</span>
              </span>
            </button>

            {/* 4. Configurações (Ícone de controles/alternância linear) */}
            <button
              role="menuitem"
              onClick={() => handleSelect('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'settings'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <SlidersHorizontal
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Configurações</span>
              </div>
            </button>
          </div>

          {/* LINHA DIVISÓRIA DISCRETA ENTRE OS GRUPOS */}
          <div className="my-1.5 mx-1 border-t border-slate-100 dark:border-slate-800" />

          {/* GRUPO 2: 2 Últimas Opções */}
          <div className="space-y-0.5" role="group">
            {/* 5. Central de ajuda */}
            <button
              role="menuitem"
              onClick={() => handleSelect('help')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'help'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Info
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Central de ajuda</span>
              </div>
            </button>

            {/* 6. Sair */}
            <button
              role="menuitem"
              onClick={() => handleSelect('signout')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left group ${
                selectedOption === 'signout'
                  ? 'bg-[#F2F4F7] dark:bg-slate-800/80 font-medium text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <LogOut
                  className="w-4.5 h-4.5 shrink-0 text-slate-800 dark:text-slate-200"
                  strokeWidth={1.8}
                />
                <span className="truncate">Sair</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Assinatura Institucional Ativa "Folium Estudante PRO"             */}
      {/* ========================================================================= */}
      {isSubscriptionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#14223D] rounded-3xl border border-[#E1E8F1] dark:border-[#344563] p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#FCE7F3] text-[#9333EA] dark:bg-pink-950/60 dark:text-pink-300">
                  <Zap className="w-3 h-3 fill-current" />
                  PRO
                </span>
                <h3 className="text-base font-bold text-[#203A65] dark:text-white">
                  Assinatura Estudante PRO
                </h3>
              </div>
              <button
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300">
                    Assinatura Institucional Ativa
                  </h4>
                  <p className="mt-0.5 leading-relaxed text-emerald-800 dark:text-emerald-400">
                    Sua conta está vinculada à matrícula <strong>{preferences.registrationNumber}</strong> com acesso ilimitado concedido pela instituição.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Benefícios liberados:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300">
                  <li>Maquete 3D interativa de todo o campus universitário</li>
                  <li>Acesso irrestrito a apostilas e notas de aula</li>
                  <li>Grade horária dinâmica e agenda diária de estudos</li>
                  <li>Assistente acadêmico Folium sem limites de consulta</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="px-4 py-2 bg-[#203A65] hover:bg-[#182C4F] text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Central de Ajuda e Suporte Discente                               */}
      {/* ========================================================================= */}
      {isHelpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#14223D] rounded-3xl border border-[#E1E8F1] dark:border-[#344563] p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-[#346BDB]" />
                <h3 className="text-base font-bold text-[#203A65] dark:text-white">
                  Central de Ajuda Folium
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Precisa de orientação acadêmica ou auxílio com as ferramentas do portal?
              </p>

              <div className="p-3 bg-[#F7F9FC] dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Atendimento Discente:
                </span>
                <p>Email: <strong className="text-[#346BDB]">suporte@folium.edu.br</strong></p>
                <p>Horário: Segunda a Sexta, das 08h às 20h</p>
                <p>Local: Bloco Administrativo – Sala 102</p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    setIsCopilotOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#EFF4FA] dark:bg-[#1C3359] text-[#203A65] dark:text-[#93C5FD] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#DDE9F6] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Falar com o Assistente Acadêmico</span>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer hover:bg-slate-300 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Confirmação de Encerramento de Sessão (Sair)                      */}
      {/* ========================================================================= */}
      {isSignOutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#14223D] rounded-3xl border border-[#E1E8F1] dark:border-[#344563] p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-3">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#203A65] dark:text-white">
              Encerrar Sessão?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Você retornará à tela inicial e suas preferências serão salvas localmente.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Sim, encerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
