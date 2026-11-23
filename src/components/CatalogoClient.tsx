'use client';

import { useState, useMemo } from 'react';
import ContentCard, { ContentCardItem } from '@/components/ContentCard';
import { Icon, type IconName } from '@/components/ui/Icon';

interface CatalogoClientProps {
  initialContents: ContentCardItem[];
  initialType?: string;
}

const VALID_TYPES = ['all', 'video', 'audio', 'article', 'pdf'];

export default function CatalogoClient({ initialContents, initialType }: CatalogoClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>(
    initialType && VALID_TYPES.includes(initialType) ? initialType : 'all'
  );
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
  const typeOptions: { key: string; label: string; icon: IconName }[] = [
    { key: 'all', label: 'Todo', icon: 'grid' },
    { key: 'video', label: 'Videos', icon: 'play' },
    { key: 'audio', label: 'Audios', icon: 'headphones' },
    { key: 'pdf', label: 'Guías PDF', icon: 'file' },
    { key: 'article', label: 'Artículos', icon: 'book' },
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

  const hasFilters = searchTerm !== '' || selectedType !== 'all' || selectedCategory !== 'all';

  return (
    <div className="space-y-10">
      <div className="space-y-6 rounded-[2rem] bg-white p-5 shadow-[0_10px_40px_rgba(11,31,58,0.06)] sm:p-8">
        {/* Buscador */}
        <label className="relative block">
          <span className="sr-only">Buscar en el catálogo</span>
          <Icon name="search" className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-body" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar: crisis, respiración, pensamientos…"
            className="h-16 w-full rounded-2xl border-2 border-ink/10 bg-paper pl-14 pr-14 text-lg text-ink placeholder:text-body/70 focus:border-brand focus:bg-white focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Borrar búsqueda"
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-body hover:bg-ink/5"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          )}
        </label>

        {/* Formatos */}
        <div>
          <p className="mb-3 text-base font-semibold text-ink">¿Qué quieres ver?</p>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filtrar por formato">
            {typeOptions.map((opt) => {
              const isActive = selectedType === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedType(opt.key)}
                  className={`inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-2 px-5 text-base font-semibold transition-colors ${
                    isActive ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white text-ink hover:border-ink/40'
                  }`}
                >
                  <Icon name={opt.icon} className="h-5 w-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Temas */}
        {categories.length > 0 && (
          <div>
            <p className="mb-3 text-base font-semibold text-ink">Temas</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tema">
              {['all', ...categories].map((cat) => {
                const isActive = cat === 'all' ? selectedCategory === 'all' : selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-10 cursor-pointer rounded-full px-4 text-base transition-colors ${
                      isActive ? 'bg-brand text-white' : 'bg-paper text-ink hover:bg-ink/10'
                    }`}
                  >
                    {cat === 'all' ? 'Todos los temas' : cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5 text-base text-body" aria-live="polite">
          <span>
            {filteredContents.length} {filteredContents.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
          </span>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-ink underline underline-offset-4"
            >
              <Icon name="refresh" className="h-4 w-4" />
              Quitar filtros
            </button>
          )}
        </div>
      </div>

      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContents.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-lg space-y-5 rounded-[2rem] bg-white p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paper text-body">
            <Icon name="search" className="h-8 w-8" />
          </span>
          <h3 className="font-display text-2xl text-ink">
            {initialContents.length === 0 ? 'Muy pronto habrá contenido aquí' : 'No encontramos resultados'}
          </h3>
          <p className="text-lg text-body">
            {initialContents.length === 0
              ? 'Estamos preparando las primeras lecciones. Vuelve pronto.'
              : 'Prueba con otra palabra o quita los filtros.'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 cursor-pointer items-center rounded-full bg-ink px-6 text-base font-semibold text-white hover:bg-brand"
            >
              Ver todo el catálogo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
