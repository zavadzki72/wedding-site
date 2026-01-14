import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GiftSelectionIcon from './gifts/GiftSelectionIcon';

const Header: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const showGiftIcon = ['/gifts', '/selection', '/payment-status'].includes(location.pathname);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="header">
        <nav className="nav_desktop">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href={isHomePage ? "#history" : "/#history"}>Nossa História</a></li>
            <li><a href={isHomePage ? "#info" : "/#info"}>Informações</a></li>
            <li><a href={isHomePage ? "#local" : "/#local"}>Como Chegar</a></li>
            <li><a href="/gifts">Presentes</a></li>
          </ul>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showGiftIcon && <GiftSelectionIcon />}
          <div className="nav_mobile">
            <button id="menu_toggle" className="menu_toggle" onClick={toggleMenu}>
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile_menu_items" className={`mobile_menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="/" onClick={toggleMenu}>Home</a>
        <a href={isHomePage ? "#history" : "/#history"} onClick={toggleMenu}>Nossa História</a>
        <a href={isHomePage ? "#info" : "/#info"} onClick={toggleMenu}>Informações</a>
        <a href={isHomePage ? "#local" : "/#local"} onClick={toggleMenu}>Como Chegar</a>
        <a href="/gifts" onClick={toggleMenu}>Presentes</a>
      </div>
    </>
  );
};

export default Header;