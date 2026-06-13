import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Atom, 
  Shirt, 
  Dumbbell, 
  CupSoda, 
  Award 
} from 'lucide-react';
import { Category } from '../types';

interface CategoryFiltersProps {
  selectedCategory: Category | 'Todos';
  onSelectCategory: (category: Category | 'Todos') => void;
}

export default function CategoryFilters({
  selectedCategory,
  onSelectCategory
}: CategoryFiltersProps) {
  
  const categoriesList: { name: Category | 'Todos'; label: string; icon: React.ReactNode }[] = [
    { name: 'Todos', label: 'Tudo', icon: <Award className="h-3.5 w-3.5" /> },
    { name: 'Proteínas', label: 'Proteínas', icon: <Flame className="h-3.5 w-3.5" /> },
    { name: 'Suplementos', label: 'Suplementos', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: 'Pré-treinos', label: 'Pré-Treino', icon: <Zap className="h-3.5 w-3.5" /> },
    { name: 'Creatinas', label: 'Creatinas', icon: <Atom className="h-3.5 w-3.5" /> },
    { name: 'Roupas Fitness', label: 'Vestuário', icon: <Shirt className="h-3.5 w-3.5" /> },
    { name: 'Equipamentos', label: 'Acessórios', icon: <Dumbbell className="h-3.5 w-3.5" /> },
    { name: 'Garrafas e Shakers', label: 'Shakers', icon: <CupSoda className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="w-full text-left" id="category-filters">
      <div className="flex flex-col space-y-2.5">
        <label className="font-mono text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">
          LINHA DE PERFORMANCE
        </label>
        
        {/* Horizontal scrollable or wrapped category selectors with glass aesthetic */}
        <div className="flex flex-wrap gap-2.5">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider font-mono transition-all duration-300 border ${
                  isSelected
                    ? 'bg-[#ccff00] border-[#ccff00] text-zinc-950 shadow-lg shadow-lime-900/15 font-black scale-105'
                    : 'glass-button-secondary text-zinc-400 hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-zinc-950' : 'text-[#ccff00]'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
