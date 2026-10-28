import React, { useState, useMemo } from 'react';
import {
  Search,
  Building,
  MapPin,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  ChevronRight,
  Info,
  Footprints,
  X,
} from 'lucide-react';
import { useEdu } from '../context/EduContext';
import { CampusMap3D } from '../components/CampusMap3D';
import { CampusBuilding } from '../types';

export const CampusMapView: React.FC = () => {
  const {
    campusBuildings,
    campusRooms,
    targetBuildingIdForMap,
    setTargetBuildingIdForMap,
  } = useEdu();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Acadêmicos' | 'Administrativos' | 'Serviços' | 'Lazer'>('Todos');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    targetBuildingIdForMap || 'biblioteca'
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter chips from Screen 4
  const categories = ['Todos', 'Acadêmicos', 'Administrativos', 'Serviços', 'Lazer'] as const;

  // Selected building object
  const currentBuilding = useMemo(() => {
    return (
      campusBuildings.find((b) => b.id === selectedBuildingId) ||
      campusBuildings.find((b) => b.id === 'biblioteca') ||
      campusBuildings[0]
    );
  }, [campusBuildings, selectedBuildingId]);

  // Building room list
  const currentRooms = useMemo(() => {
    return campusRooms.filter((r) => r.buildingId === currentBuilding?.id);
  }, [campusRooms, currentBuilding]);

  // Filtered buildings for search
  const filteredBuildings = useMemo(() => {
    return campusBuildings.filter((b) => {
      const matchQuery =
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchCat = true;
      if (selectedCategory === 'Acadêmicos') matchCat = ['bloco-a', 'bloco-b', 'bloco-c'].includes(b.id);
      else if (selectedCategory === 'Administrativos') matchCat = b.id === 'adm';
      else if (selectedCategory === 'Serviços') matchCat = ['biblioteca', 'ginasio'].includes(b.id);
      else if (selectedCategory === 'Lazer') matchCat = b.id === 'ginasio';

      return matchQuery && matchCat;
    });
  }, [campusBuildings, searchQuery, selectedCategory]);

  const handleSelectBuilding = (bId: string) => {
    setSelectedBuildingId(bId);
    setTargetBuildingIdForMap(bId);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* 1. Header: 4. Mapa do Campus */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#203A65] dark:text-white tracking-tight">
            4. Mapa do Campus
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Localização tridimensional dos blocos acadêmicos, salas e serviços universitários.
          </p>
        </div>
      </div>

      {/* 2. Barra de Busca e Chips de Categorias (Exatamente como Tela 4) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar prédio, sala ou local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E8F1] dark:border-[#344563] bg-white dark:bg-[#14223D] text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#346BDB] shadow-xs"
          />
        </div>

        {/* Chips de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#346BDB] text-white shadow-xs'
                  : 'bg-white dark:bg-[#14223D] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E1E8F1] dark:border-[#344563]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Se houver busca, mostrar resultados em lista rápida */}
      {searchQuery && (
        <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Resultados da busca:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filteredBuildings.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  handleSelectBuilding(b.id);
                  setSearchQuery('');
                }}
                className="text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <div className="font-bold text-[#203A65] dark:text-white">{b.name}</div>
                <div className="text-[11px] text-slate-500">{b.code} • {b.floorsCount} andares</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Área Principal do Mapa 3D com Controles e Card Flutuante */}
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-2xl overflow-hidden border border-[#E1E8F1] dark:border-[#344563] shadow-md bg-slate-100 dark:bg-[#0B132B]">
        {/* Componente 3D Canvas Real */}
        <CampusMap3D
          buildings={campusBuildings}
          selectedBuildingId={selectedBuildingId}
          onSelectBuilding={handleSelectBuilding}
          className="w-full h-full"
        />

        {/* Botão Superior "Visão Geral" */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => handleSelectBuilding('biblioteca')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-[#14223D]/95 backdrop-blur-md rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-[#14223D] cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#346BDB]" />
            Visão geral
          </button>
        </div>

        {/* Card Flutuante do Prédio Selecionado (Exatamente como Tela 4) */}
        {currentBuilding && (
          <div className="absolute bottom-4 right-4 z-20 w-80 sm:w-96 bg-white/95 dark:bg-[#14223D]/95 backdrop-blur-md rounded-xl border border-[#E1E8F1] dark:border-[#344563] shadow-xl p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-3.5">
              {/* Imagem em miniatura do prédio */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 relative border border-slate-200 dark:border-slate-700">
                <img
                  src="/campus_hero.jpg"
                  alt={currentBuilding.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informações resumidas */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-[#346BDB] dark:text-blue-300 font-bold">
                  {currentBuilding.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#203A65] dark:text-white truncate mt-1">
                  {currentBuilding.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  Acervo físico e digital, salas de estudo e computadores.
                </p>
              </div>
            </div>

            {/* Metadados e Horário */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                8:00 - 22:00
              </span>
              <span className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-slate-400" />
                Acesso livre
              </span>
            </div>

            {/* Botão de Ação */}
            <div className="mt-3">
              <button
                onClick={() => setShowDetailModal(true)}
                className="w-full py-2 bg-[#346BDB] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer text-center"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Prédio */}
      {showDetailModal && currentBuilding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#14223D] rounded-xl border border-[#E1E8F1] dark:border-[#344563] shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
                  {currentBuilding.code}
                </span>
                <h2 className="text-lg font-bold text-[#203A65] dark:text-white mt-1">
                  {currentBuilding.name}
                </h2>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentBuilding.directions || currentBuilding.floorsDesc}
              </p>

              <div>
                <h3 className="font-bold text-[#203A65] dark:text-white mb-2">
                  Departamentos e Instalações:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentBuilding.facilities.map((fac, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#203A65] dark:text-white mb-2">
                  Salas Cadastradas ({currentRooms.length}):
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentRooms.map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-800/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{r.name}</div>
                        <div className="text-[11px] text-slate-500">{r.floor} • Capacidade: {r.capacity} alunos</div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                        {r.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-[#346BDB] text-white text-xs font-semibold rounded-lg hover:bg-blue-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
