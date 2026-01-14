import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useGiftSelection } from '../../context/GiftSelectionContext';

interface GiftCardProps {
  product: Product;
}

const GiftCard: React.FC<GiftCardProps> = ({ product }) => {
  const { selectGift, removeGift, selectedItems } = useGiftSelection();
  const navigate = useNavigate();
  const isSelected = selectedItems.some(item => item.id === product.id);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleGiftNow = () => {
    if (!isSelected) {
      selectGift(product);
    }
    navigate('/selection');
  };

  const handleAddToSelection = () => {
    selectGift(product);
  };

  return (
    <div className="gift-card">
      <div className="gift-card-image">
        <img src={product.photo} alt={product.name} />
      </div>
      <div className="gift-card-content">
        <h3 className="gift-card-name">{product.name}</h3>
        <p className="gift-card-price">{formatCurrency(product.value)}</p>
        <div className="gift-card-actions">
          {isSelected ? (
            <button className="button remove" onClick={() => removeGift(product.id)}>
              <i className="fas fa-times"></i> Remover Seleção
            </button>
          ) : (
            <>
              <button className="button primary" onClick={handleGiftNow}>
                Presentear
              </button>
              <button className="button tertiary" onClick={handleAddToSelection}>
                Adicionar e escolher outro
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftCard;