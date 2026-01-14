import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { Category } from '../../types';
import '../../components/manage/InviteModal.css';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'isSold'>, id?: string) => void;
  productToEdit: Product | null;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [value, setValue] = useState<number | ''>('');
  const [category, setCategory] = useState<Category>(Category.OUTROS);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPhoto(productToEdit.photo);
      setValue(productToEdit.value);
      setCategory(productToEdit.category);
    } else {
      setName('');
      setPhoto('');
      setValue('');
      setCategory(Category.OUTROS);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && photo.trim() && value as number > 0) {
      onSave({ name, photo, value: Number(value), category }, productToEdit?.id);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{productToEdit ? 'Editar Presente' : 'Adicionar Novo Presente'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Presente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jogo de Panelas"
              required
            />
          </div>
          <div className="form-group">
            <label>URL da Foto</label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              required
            />
          </div>
          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="150.00"
              required
            />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(Number(e.target.value) as Category)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', fontFamily: 'inherit', fontSize: '1rem' }}
              required
            >
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
          <div className="modal-actions">
            <button type="button" className="button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="button primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiftModal;