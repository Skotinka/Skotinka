import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    if (login && password) {
      // Временная логика
      navigate('/login');
    }
  };

  return (
    <div className="register-page-exact">
      <div className="register-container-exact">
        {/* Заголовок FinWall */}
        <div className="logo-section-exact">
          <h1 className="logo-exact">FinWall</h1>
        </div>
        
        {/* Секция регистрации */}
        <div className="register-section-exact">
          <div className="register-title-exact">Регистрация</div>
          
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

        {/* Кнопка */}
        <div className="buttons-container-exact">
          <div className="button-spacing-exact">
            <button 
              className="create-account-button-exact primary-button-exact"
              onClick={handleCreateAccount}
              disabled={!login || !password}
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;