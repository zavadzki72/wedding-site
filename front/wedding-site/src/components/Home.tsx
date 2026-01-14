import React from 'react';
import { useFadeIn } from '../hooks/useFadeIn';

const Home: React.FC = () => {
  const fadeInRef = useFadeIn<HTMLElement>();

  return (
    <section id="home" className="home fade-in" ref={fadeInRef}>
      <div>
        <img src="/assets/images/banner.JPEG" alt="Foto do casal" />
      </div>
    </section>
  );
};

export default Home;