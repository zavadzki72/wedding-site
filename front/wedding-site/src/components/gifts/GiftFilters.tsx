import React from 'react';
import { Category } from '../../types';

interface GiftFiltersProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: Category | 'all') => void;
}

const GiftFilters: React.FC<GiftFiltersProps> = ({ onSearchChange, onCategoryChange }) => {
  return (
    <div className="gift-filters">
      <input
        type="text"
        placeholder="Buscar por nome do presente..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
        className="category-select"
      >
        <option value="all">Todas as Categorias</option>
        <option value={Category.ELETRODOMESTICO}>Eletrodoméstico</option>
        <option value={Category.MOVEIS}>Móveis</option>
        <option value={Category.DECORACAO}>Decoração</option>
        <option value={Category.COZINHA}>Cozinha</option>
        <option value={Category.CAMA_MESA_BANHO}>Cama, Mesa e Banho</option>
        <option value={Category.ELETRONICOS}>Eletrônicos</option>
        <option value={Category.FERRAMENTAS}>Ferramentas</option>
        <option value={Category.LAZER}>Lazer</option>
        <option value={Category.OUTROS}>Outros</option>
      </select>
    </div>
  );
};

export default GiftFilters;