import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';

const Info: React.FC = () => {
  const fadeInRef = useFadeIn<HTMLElement>();

  return (
    <section id="info" className="info fade-in" ref={fadeInRef}>
      <div className="info_title">
        <h2>Informações Importantes</h2>
        <p>Tudo o que você precisa saber para aproveitar o nosso grande dia.</p>
      </div>
      <div className="info_grid">
        <div className="info_card">
          <i className="fa-regular fa-gem"></i>
          <h3>Cerimônia</h3>
          <p>A cerimônia religiosa será realizada às <strong>16:00</strong> no dia 20 de Abril de 2026, no centro de eventos da Volvo. Pedimos que cheguem com 30 minutos de antecedência.</p>
        </div>
        <div className="info_card">
          <i className="fa-solid fa-champagne-glasses"></i>
          <h3>Festa</h3>
          <p>Logo após a cerimônia, a recepção e a festa acontecerão no mesmo local. Preparem-se para celebrar e dançar a noite toda conosco!</p>
        </div>
        <div className="info_card">
          <i className="fa-solid fa-user-tie"></i>
          <h3>Traje</h3>
          <p>Sugerimos o traje <strong>Esporte Fino</strong>. Queremos que se sintam elegantes, mas acima de tudo, confortáveis para celebrar conosco do início ao fim! Para as convidadas <strong>não esquecam do seu chinelo</strong>!</p>
        </div>
        <div className="info_card">
          <i className="fa-solid fa-envelope-circle-check"></i>
          <h3>Confirme sua Presença</h3>
          <p>Sua presença é muito importante para nós! Por favor, confirme se poderá comparecer até o dia <strong>20 de janeiro de 2026</strong> através do link de confirmação</p>
        </div>
        <div className="info_card">
          <i className="fa-solid fa-camera-retro"></i>
          <h3>Fotos</h3>
          <p>Esperamos que vocês tirem muitas fotos e nos mostrem depois!</p>
        </div>
        <div className="info_card">
          <i className="fa-solid fa-gift"></i>
          <h3>Presentes</h3>
          <p>Sua presença é o nosso maior presente! Mas, se desejar nos presentear, criamos uma lista com muito carinho. Veja as opções na seção de presentes.</p>
        </div>
      </div>
    </section>
  );
};

export default Info;