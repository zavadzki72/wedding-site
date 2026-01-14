import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';

const Local: React.FC = () => {
  const fadeInRef = useFadeIn<HTMLElement>();

  return (
    <section id="local" className="local fade-in" ref={fadeInRef}>
      <div className="local_title">
        <h2>Como Chegar</h2>
        <p>A cerimônia e a festa serão realizadas no mesmo local, para seu maior conforto.</p>
      </div>
      <div className="local_container">
        <div className="local_info">
          <h3>
            <i className="fa-regular fa-map"></i>
            Centro de Eventos Volvo
          </h3>
          <p className="local_address">Rua Eduardo Sprada, 6447, CIC - Curitiba, PR</p>
          
          <div className="local_buttons">
            <a href="https://www.google.com/maps/dir/?api=1&destination=Rua Eduardo Sprada, 6447, CIC" target="_blank" rel="noopener noreferrer" className="btn-local">
              <i className="fa-brands fa-google"></i> <span className="button-text">Google Maps</span>
            </a>
            <a href="https://waze.com/ul?q=Rua Eduardo Sprada, 6447, CIC" target="_blank" rel="noopener noreferrer" className="btn-local btn-secondary">
              <i className="fa-brands fa-waze"></i> <span className="button-text">Waze</span>
            </a>
          </div>
          
          <div className="local_tips">
            <div className="tip_card">
              <i className="fa-solid fa-square-parking"></i>
              <div>
                <h4>Estacionamento</h4>
                <p>O local possui estacionamento próprio gratuito. Fique tranquilo e venha celebrar conosco!</p>
              </div>
            </div>
            <div className="tip_card">
              <i className="fa-solid fa-car"></i>
              <div>
                <h4>Transporte por App</h4>
                <p>Se for beber, não dirija! Utilize aplicativos como Uber e 99 para ir e voltar com segurança.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="local_map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.572186003957!2d-49.36779452385686!3d-25.452562633786226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce207fe51df53%3A0xce09f49f3d4983c!2sR.%20Eduardo%20Sprada%2C%206447%20-%20Cidade%20Industrial%20de%20Curitiba%2C%20Curitiba%20-%20PR%2C%2081290-110!5e0!3m2!1sen!2sbr!4v1756356992069!5m2!1sen!2sbr" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  );
};

export default Local;