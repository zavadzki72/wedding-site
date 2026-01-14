import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (status === 'success' && externalReference && paymentId) {
      const markAsSold = async () => {
        try {
          await api.put(`/Gift/purchases/${externalReference}/mark-as-sold`, `"${paymentId}"`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error('Erro ao marcar o produto como vendido:', error);
        }
      };
      markAsSold();
    }
  }, [status, externalReference, paymentId]);

  const statusInfo = {
    success: {
      title: 'Obrigado pelo seu presente!',
      message: 'Recebemos a confirmação do seu presente e ele já foi comprado. Sua generosidade enche nossos corações de alegria!',
      icon: 'fa-check-circle',
      color: '#28a745'
    },
    pending: {
      title: 'Pagamento em Processamento',
      message: 'Seu pagamento está sendo processado. Avisaremos assim que for confirmado. Obrigado pelo carinho!',
      icon: 'fa-hourglass-half',
      color: '#ffc107'
    },
    error: {
      title: 'Ocorreu um Erro',
      message: 'Não foi possível processar seu pagamento. Por favor, tente novamente ou entre em contato conosco.',
      icon: 'fa-times-circle',
      color: '#dc3545'
    },
  };

  const currentStatus = status === 'success' || status === 'pending' || status === 'error' ? statusInfo[status] : statusInfo.error;

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <i className={`fas ${currentStatus.icon}`} style={{ color: currentStatus.color }}></i>
        <h2>{currentStatus.title}</h2>
        <p>{currentStatus.message}</p>
        <Link to="/gifts" className="button primary">Voltar para a lista</Link>
      </div>
    </div>
  );
};

export default PaymentStatusPage;