import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../utils/api';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ФИКС 1: Проверяем ввод
  const validateInput = () => {
    if (!login.trim()) {
      setError('Введите логин');
      return false;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await api.login({ 
        login: login.trim(), 
        password: password.trim() 
      });
      
      if (result.success) {
        setAuthToken(result.data.token);
        if (onLogin) onLogin();
        navigate('/dashboard');
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page-exact">
      <div className="login-container-exact">
        <div className="logo-section-exact">
          <h1 className="logo-exact">FinWall</h1>
        </div>
        
        <div className="login-section-exact">
          <div className="login-title-exact">Войти в аккаунт</div>
          
          {error && (
            <div className="error-message-login">
              ⚠️ {error}
            </div>
          )}
          
          <div className="input-row-exact">
            <span className="input-label-exact">Логин:</span>
            <div className="input-wrapper-exact">
              <input
                type="text"
                value={login}
                onChange={(e) => {
                  setLogin(e.target.value);
                  if (error) setError('');
                }}
                className="text-input-exact"
                placeholder="Введите логин"
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="input-row-exact">
            <span className="input-label-exact">Пароль:</span>
            <div className="input-wrapper-exact">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="text-input-exact"
                placeholder="Введите пароль"
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="buttons-container-exact">
          <div className="button-spacing-exact">
            <button 
              className="login-button-exact primary-button-exact"
              onClick={handleLogin}
              disabled={loading || !login.trim() || !password.trim()}
            >
              {loading ? 'Вход...' : 'Войти в аккаунт'}
            </button>
          </div>
          
          <div className="button-spacing-exact">
            <button 
              className="create-account-button-exact secondary-button-exact"
              onClick={handleCreateAccount}
              disabled={loading}
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;