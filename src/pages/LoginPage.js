import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (login && password) {
      onLoginSuccess();
      navigate('/dashboard');
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="login-page-exact">
      <div className="login-container-exact">
        {/* Заголовок FinWall */}
        <div className="logo-section-exact">
          <h1 className="logo-exact">FinWall</h1>
        </div>
        
        {/* Секция входа */}
        <div className="login-section-exact">
          <div className="login-title-exact">Войти в аккаунт</div>
          
          <div className="input-row-exact">
            <span className="input-label-exact">Логин:</span>
            <div className="input-wrapper-exact">
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="text-input-exact"
              />
            </div>
          </div>
          
          <div className="input-row-exact">
            <span className="input-label-exact">Пароль:</span>
            <div className="input-wrapper-exact">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input-exact"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="buttons-container-exact">
          <div className="button-spacing-exact">
            <button 
              className="login-button-exact primary-button-exact"
              onClick={handleLogin}
              disabled={!login || !password}
            >
              Войти в аккаунт
            </button>
          </div>
          
          <div className="button-spacing-exact">
            <button 
              className="create-account-button-exact secondary-button-exact"
              onClick={handleCreateAccount}
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