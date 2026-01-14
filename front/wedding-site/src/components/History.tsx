import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';

const History: React.FC = () => {
  const fadeInRef = useFadeIn<HTMLElement>();

  return (
    <section id="history" className="history fade-in" ref={fadeInRef}>
      <div className="history_title">
        <h2>Nossa História</h2>
        <p>Uma pequena viagem no tempo sobre como chegamos até aqui.</p>
      </div>
      <div className="timeline">
        <div className="timeline_item">
          <div className="timeline_dot"></div>
          <div className="timeline_content">
            <img src="/assets/images/tl_1.JPEG" alt="Como nos conhecemos" />
            <h3>Como nos Conhecemos</h3>
            <span>Outubro de 2022</span>
            <p>Nossos caminhos se cruzaram quando fomos apresentados por nossos primos e amigos. Foi amor a primeira vista.</p>
          </div>
        </div>
        <div className="timeline_item right">
          <div className="timeline_dot"></div>
          <div className="timeline_content">
            <img src="/assets/images/tl_2.JPEG" alt="Primeiro beijo" />
            <h3>O Primeiro Beijo</h3>
            <span>Novembro de 2022</span>
            <p>Um momento mágico que selou o início da nossa jornada juntos. Foi ali que tivemos a certeza do nosso sentimento.</p>
          </div>
        </div>
        <div className="timeline_item">
          <div className="timeline_dot"></div>
          <div className="timeline_content">
            <img src="/assets/images/tl_3.JPEG" alt="O pedido de namoro" />
            <h3>O Pedido de Namoro</h3>
            <span>Novembro de 2022</span>
            <p>Em um jantar à luz de velas, a pergunta foi feita e um 'sim' emocionado mudou nossas vidas para sempre.</p>
          </div>
        </div>
        <div className="timeline_item right">
          <div className="timeline_dot"></div>
          <div className="timeline_content">
            <img src="/assets/images/tl_4.JPEG" alt="O pedido de casamento" />
            <h3>O Pedido de Casamento</h3>
            <span>Abril de 2025</span>
            <p>Em um lugar especial veio o pedido que nos trouxe até esse momento: A contagem regressiva para o nosso sim perante a Deus e todos os convidados.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;