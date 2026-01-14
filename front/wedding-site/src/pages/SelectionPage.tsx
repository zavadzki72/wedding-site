import React, { useState } from 'react';
import { useGiftSelection } from '../context/GiftSelectionContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { CheckoutDto } from '../types';

const SelectionPage: React.FC = () => {
  const { selectedItems, removeGift, getSelectionTotal, clearSelection } = useGiftSelection();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CheckoutDto = {
      name,
      message,
      products: selectedItems.map(item => item.id),
    };

    try {
      const response = await api.post('/Gift/products/buy', payload);
      const paymentUrl = response.data.data;

      if (paymentUrl) {
        clearSelection();
        window.location.href = paymentUrl;
      } else {
        throw new Error("URL de pagamento não recebida.");
      }
    } catch (err) {
      setError('Não foi possível gerar o link de pagamento. Por favor, tente novamente.');
      console.error('Erro no checkout:', err);
      setLoading(false);
    }
  };

  return (
    <div className="cart-page-container">
      <div className="cart-card">
        <Link to="/gifts" className="back-to-gifts-link">
          <i className="fas fa-arrow-left"></i> Voltar para a lista
        </Link>
        <h1>Minha Seleção de Presentes</h1>
        {selectedItems.length === 0 ? (
          <div className="empty-cart">
            <p>Você ainda não selecionou nenhum presente.</p>
            <Link to="/gifts" className="button primary">Ver a lista de presentes</Link>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-list">
              {selectedItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.photo} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{formatCurrency(item.value)}</p>
                  </div>
                  <button onClick={() => removeGift(item.id)} className="cart-item-remove">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary-and-form">
              <div className="cart-summary">
                <p>Total</p>
                <span>{formatCurrency(getSelectionTotal())}</span>
              </div>
              <form onSubmit={handleSubmit} className="cart-form">
                <h2>Deixe sua mensagem</h2>
                <div className="form-group">
                  <label htmlFor="name">Seu nome</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nomes"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mensagem de carinho</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva aqui sua mensagem para os noivos..."
                    rows={4}
                    required
                  />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="button primary" disabled={loading}>
                  {loading ? 'A processar...' : 'Ir para o Pagamento'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionPage;