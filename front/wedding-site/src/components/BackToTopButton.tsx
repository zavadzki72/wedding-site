import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <a href="#banner" id="back_to_top" title="Voltar ao Topo" className={isVisible ? 'visible' : ''}>
      <i className="fas fa-arrow-up"></i>
    </a>
  );
};

export default BackToTopButton;