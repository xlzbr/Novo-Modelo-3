import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  Edit3,
  Save,
  FileText,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { StudentAvatar } from '../components/Sidebar';

export const ProfileView: React.FC = () => {
  const { preferences, updatePreferences } = useEdu();

  const [activeTab, setActiveTab] = useState<'Informações pessoais' | 'Acadêmicas' | 'Preferências' | 'Documentos'>('Informações pessoais');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states initialized with Luiz Gustavo's data
  const [fullName, setFullName] = useState(preferences.studentName || 'Luiz Gustavo Santos da Silva Filho');
  const [birthDate, setBirthDate] = useState(preferences.birthDate || '15/06/2005');
  const [email, setEmail] = useState(preferences.studentEmail || 'luiz.filho@folium.edu.br');
  const [address, setAddress] = useState(preferences.address || 'Rua das Flores, 123 - São Paulo/SP');
  const [phone, setPhone] = useState(preferences.phone || '(11) 98765-4321');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      studentName: fullName,
      birthDate,
      studentEmail: email,
      address,
      phone,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Card com Avatar, Nome, Matrícula e Status (Exatamente como Tela 8) */}
      <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar Ilustrado do Aluno */}
        <div className="relative">
          <StudentAvatar className="w-24 h-24 ring-4 ring-[#EFF4FA] dark:ring-slate-800 shadow-sm" />
        </div>

        {/* Informações Resumidas */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#203A65] dark:text-white">
            {fullName}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Matrícula:{' '}
              <strong className="text-slate-700 dark:text-slate-200 font-mono">
                {preferences.registrationNumber || '2025E134587'}
              </strong>
            </span>
            <span>•</span>
            <span>
              Curso:{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {preferences.courseName || 'Ciência da Computação'}
              </strong>
            </span>
            <span>•</span>
            <span>
              Período:{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {preferences.period || '4º período'}
              </strong>
            </span>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#149B78] dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#149B78] animate-pulse" />
              Ativo
            </span>
          </div>
        </div>
      </div>

      {/* 2. Abas do Perfil (Exatamente como Tela 8) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
        {(['Informações pessoais', 'Acadêmicas', 'Preferências', 'Documentos'] as const).map((tab) => (
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

      {/* 3. Conteúdo da Aba Ativa */}
      {activeTab === 'Informações pessoais' && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-[#203A65] dark:text-white">
                Dados pessoais
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mantenha suas informações de contato e endereço sempre atualizadas.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Informações salvas com sucesso!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Data de nascimento
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* E-mail Institucional */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  E-mail institucional
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Endereço
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Telefone
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botão de Ação: [Editar informações] ou [Salvar] */}
            <div className="pt-4 flex justify-end">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar informações
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#149B78] hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar alterações
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Aba Acadêmicas */}
      {activeTab === 'Acadêmicas' && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#203A65] dark:text-white">
            Histórico e Dados Curriculares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-xs text-slate-500">Coeficiente de Rendimento</span>
              <p className="text-2xl font-bold text-[#203A65] dark:text-white font-mono mt-1">8,2</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-xs text-slate-500">Carga Horária Cumprida</span>
              <p className="text-2xl font-bold text-[#346BDB] font-mono mt-1">480h / 720h</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="text-xs text-slate-500">Integralização</span>
              <p className="text-2xl font-bold text-[#149B78] font-mono mt-1">68%</p>
            </div>
          </div>
        </div>
      )}

      {/* Aba Documentos */}
      {activeTab === 'Documentos' && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-[#203A65] dark:text-white mb-2">
            Documentos Oficiais
          </h2>
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#346BDB]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#203A65] dark:text-white">Atestado de Matrícula (2025/1)</h4>
                  <p className="text-[11px] text-slate-400">Emitido digitalmente com autenticação eletrônica</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-md bg-blue-50 text-[#346BDB] dark:bg-blue-900/30 text-xs font-semibold flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Baixar PDF
              </button>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#346BDB]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#203A65] dark:text-white">Carteirinha Digital de Estudante</h4>
                  <p className="text-[11px] text-slate-400">Válida para meia-entrada e biblioteca até 03/2026</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-md bg-blue-50 text-[#346BDB] dark:bg-blue-900/30 text-xs font-semibold flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Ver Carteira
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
