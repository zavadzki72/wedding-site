import React from 'react';
import Countdown from './Countdown';

const Banner: React.FC = () => {
  return (
    <section id="banner" className="banner">
      <div>
        <div className="banner_content">
          <div className="banner_content_names">
            Evelyn <p>&</p> Marccus
          </div>
          <div className="banner_content_p">
            <p>20 de ABRIL, 2026 - CURITIBA - PR</p>
            <p id="countdown_wrapper">
              <Countdown />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;