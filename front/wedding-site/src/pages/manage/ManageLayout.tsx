import React, { useState } from 'react'; // Importe o useState
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import './ManageLayout.css';

const ManageLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar a sidebar

  const handleLogout = () => {
    localStorage.removeItem('@WeddingApp:token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="manage-layout">
      <button className="menu-toggle-manage" onClick={toggleSidebar}>
        <i className={isSidebarOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src="/assets/images/logo.png" alt="Monograma E&M" className="sidebar-logo" />
          </Link>
          <h2 className="sidebar-title">Painel dos Noivos</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/manage/invites" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-envelope nav-icon"></i>
                Convites
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage/guests" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-users nav-icon"></i>
                Convidados
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage/gifts" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-gift nav-icon"></i>
                Presentes
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt nav-icon"></i>
            Sair
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ManageLayout;