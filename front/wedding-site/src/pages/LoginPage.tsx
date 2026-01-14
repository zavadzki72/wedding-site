import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/Manager/get-token', {
        email,
        password,
      });

      const token = response.data.data;

      if (!token) {
        throw new Error("Token não encontrado na resposta da API");
      }

      localStorage.setItem('@WeddingApp:token', token);
      
      setTimeout(() => navigate('/manage'), 300);

    } catch (err) {
      setError('E-mail ou senha inválidos. Tente novamente.');
      console.error('Falha no login:', err);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/">
          <img src="/assets/images/logo.png" alt="Monograma E&M" className="login-logo" />
        </Link>

        <h2 className="login-title">Acesso Restrito</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              disabled={loading}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;