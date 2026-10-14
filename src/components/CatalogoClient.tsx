'use client';

import { useState, useMemo } from 'react';
import ContentCard, { ContentCardItem } from '@/components/ContentCard';

interface CatalogoClientProps {
  initialContents: ContentCardItem[];
}

export default function CatalogoClient({ initialContents }: CatalogoClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories from content
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialContents.forEach((c) => {
      if (c.category && c.category.trim() !== '') {
        set.add(c.category.trim());
      }
    });
    return Array.from(set);
  }, [initialContents]);

  // Types list with friendly labels and icons
  const typeOptions = [
    { key: 'all', label: 'Todo el Material', icon: 'grid_view' },
    { key: 'video', label: 'Masterclasses en Video', icon: 'play_circle' },
    { key: 'audio', label: 'Audios de Calma', icon: 'headphones' },
    { key: 'article', label: 'Lecturas y Artículos', icon: 'menu_book' },
    { key: 'pdf', label: 'Guías y PDF', icon: 'picture_as_pdf' },
  ];

  // Filter content
  const filteredContents = useMemo(() => {
    return initialContents.filter((item) => {
      // Type match
      if (selectedType !== 'all') {
        const itemType = (item.type || '').toLowerCase();
        if (selectedType === 'article') {
          if (itemType !== 'article' && itemType !== 'articulo') return false;
        } else if (itemType !== selectedType) {
          return false;
        }
      }

      // Category match
      if (selectedCategory !== 'all') {
        if ((item.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search match (ignora mayúsculas y acentos)
      if (searchTerm.trim() !== '') {
        const normalize = (str: string) => 
          str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        
        const query = normalize(searchTerm);
        const matchTitle = normalize(item.title || '').includes(query);
        const matchDesc = normalize(item.description || '').includes(query);
        const matchCat = normalize(item.category || '').includes(query);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [initialContents, selectedType, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-10">
      {/* Search & Filter Toolbar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-black/8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
        
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tema, palabra clave (ej. crisis, respiración, pensamientos)..."
            className="w-full pl-12 pr-10 py-3.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white rounded-2xl border border-transparent focus:border-[#133a73] text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              title="Borrar búsqueda"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Format Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Formato:
          </span>
          {typeOptions.map((opt) => {
            const isActive = selectedType === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelectedType(opt.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#001531] text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Pills (if any exist) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Temas:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#133a73] text-white'
                  : 'bg-transparent text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Todos los temas
            </button>
            {categories.map((cat) => {
              const isCatActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isCatActive
                      ? 'bg-[#133a73] text-white'
                      : 'bg-transparent text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filters / Results counter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-black/5">
          <span>
            Mostrando <strong>{filteredContents.length}</strong> {filteredContents.length === 1 ? 'recurso' : 'recursos'}
          </span>
          {(searchTerm !== '' || selectedType !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-[#133a73] font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Restablecer filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContents.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 text-center border border-black/8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 className="font-bold text-lg text-neutral-900">No encontramos resultados</h3>
          <p className="text-sm text-neutral-500">
            No hay recursos que coincidan con los filtros seleccionados. Intenta buscar otro término o restablece los filtros.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#001531] text-white text-xs font-bold hover:bg-[#133a73] transition-colors"
          >
            <span>Ver todo el catálogo</span>
          </button>
        </div>
      )}
    </div>
  );
}
