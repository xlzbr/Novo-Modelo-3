import React, { useState } from 'react';
import {
  Palette,
  Bell,
  Shield,
  Eye,
  Check,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, theme, toggleTheme } = useEdu();

  // Selected sub-tab from Screen 9
  const [activeTab, setActiveTab] = useState<'Aparência' | 'Notificações' | 'Privacidade e conta' | 'Acessibilidade'>('Aparência');

  // Appearance state
  const [selectedTheme, setSelectedTheme] = useState<'Claro' | 'Escuro' | 'Sistema'>(
    theme === 'dark' ? 'Escuro' : 'Claro'
  );
  const [selectedColor, setSelectedColor] = useState('#346BDB');
  const [useAnimations, setUseAnimations] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [classReminders, setClassReminders] = useState('30min');

  // Save feedback
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSettings = () => {
    // Update theme if changed
    if (selectedTheme === 'Escuro' && theme !== 'dark') {
      toggleTheme();
    } else if (selectedTheme === 'Claro' && theme !== 'light') {
      toggleTheme();
    }

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const colorSwatches = [
    { id: 'blue', hex: '#346BDB', label: 'Azul Folium' },
    { id: 'teal', hex: '#149B78', label: 'Verde Esmeralda' },
    { id: 'emerald', hex: '#10B981', label: 'Menta' },
    { id: 'orange', hex: '#E99A28', label: 'Âmbar' },
    { id: 'red', hex: '#E84B58', label: 'Coral' },
    { id: 'purple', hex: '#8B5CF6', label: 'Índigo' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Header: 9. Configurações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            9. Configurações
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalize tema visual, canais de notificações, privacidade e acessibilidade da plataforma.
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#149B78] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Configurações salvas com sucesso!
          </div>
        )}
      </div>

      {/* 2. Grid de Configurações (Coluna lateral de abas + Coluna principal) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Menu Lateral das Configurações (md:col-span-4 lg:col-span-3) */}
        <div className="md:col-span-4 lg:col-span-3 bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-2.5 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('Aparência')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'Aparência'
                ? 'bg-[#EFF4FA] dark:bg-slate-800 text-[#346BDB] dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Aparência</span>
          </button>

          <button
            onClick={() => setActiveTab('Notificações')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'Notificações'
                ? 'bg-[#EFF4FA] dark:bg-slate-800 text-[#346BDB] dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
          </button>

          <button
            onClick={() => setActiveTab('Privacidade e conta')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'Privacidade e conta'
                ? 'bg-[#EFF4FA] dark:bg-slate-800 text-[#346BDB] dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacidade e conta</span>
          </button>

          <button
            onClick={() => setActiveTab('Acessibilidade')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'Acessibilidade'
                ? 'bg-[#EFF4FA] dark:bg-slate-800 text-[#346BDB] dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Acessibilidade</span>
          </button>
        </div>

        {/* Conteúdo Principal (md:col-span-8 lg:col-span-9) */}
        <div className="md:col-span-8 lg:col-span-9 bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 shadow-xs flex flex-col justify-between min-h-[480px]">
          {/* Aba Aparência (Exatamente como Tela 9) */}
          {activeTab === 'Aparência' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#203A65] dark:text-white">
                  Aparência
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Escolha o modo de cor preferido e a paleta de realces do portal.
                </p>
              </div>

              {/* Tema: Claro, Escuro, Sistema */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tema
                </label>
                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                  {(['Claro', 'Escuro', 'Sistema'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTheme(t)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedTheme === t
                          ? 'bg-white dark:bg-[#14223D] text-[#203A65] dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <input
                        type="radio"
                        readOnly
                        checked={selectedTheme === t}
                        className="w-3.5 h-3.5 text-[#346BDB] accent-[#346BDB]"
                      />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cores da Interface */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cores da interface
                </label>
                <div className="flex items-center gap-3">
                  {colorSwatches.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                        selectedColor === color.hex ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    >
                      {selectedColor === color.hex && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferências (Switches) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preferências
                </h3>

                {/* Switch: Usar animações */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Usar animações
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Transições suaves ao alternar entre páginas e abas.
                    </div>
                  </div>
                  <button
                    onClick={() => setUseAnimations(!useAnimations)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      useAnimations ? 'bg-[#346BDB]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        useAnimations ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch: Reduzir movimento */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Reduzir movimento
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Minimiza efeitos de rolagem e acelerações na tela.
                    </div>
                  </div>
                  <button
                    onClick={() => setReduceMotion(!reduceMotion)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      reduceMotion ? 'bg-[#346BDB]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        reduceMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch: Contraste alto */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Contraste alto
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Aumenta as bordas e a saturação de textos secundários.
                    </div>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      highContrast ? 'bg-[#346BDB]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Aba Notificações */}
          {activeTab === 'Notificações' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#203A65] dark:text-white">
                Canais de Notificação
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Receber lembretes por e-mail
                  </span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#346BDB] accent-[#346BDB]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Aba Privacidade e conta */}
          {activeTab === 'Privacidade e conta' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#203A65] dark:text-white">
                Segurança e Privacidade
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seus dados acadêmicos são protegidos sob a LGPD com criptografia ponta a ponta.
              </p>
            </div>
          )}

          {/* Aba Acessibilidade */}
          {activeTab === 'Acessibilidade' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#203A65] dark:text-white">
                Recursos de Acessibilidade
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compatibilidade nativa com leitores de tela e navegação integral por teclado.
              </p>
            </div>
          )}

          {/* Botão de Salvar Alterações (Direita inferior) */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-lg bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
