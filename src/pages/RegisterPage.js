import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../utils/api';
import './RegisterPage.css';

function RegisterPage( {onRegister}) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!login.trim()) {
      setError('Введите логин');
      return false;
    }
    if (login.length < 3) {
      setError('Логин должен быть не менее 3 символов');
      return false;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return false;
    }
    if (password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateInput()) return;

    setLoading(true);
    setError('');

    try {
      const result = await api.register({ 
        login: login.trim(), 
        password: password.trim()
        // ФИКС 1: Без email
      });
      
      if (result.success) {
        setAuthToken(result.data.token);
        if (onRegister) onRegister();
        setError('✅ Аккаунт успешно создан!');
        
        // Переходим на дашборд через 1.5 секунды
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(result.error || 'Ошибка создания аккаунта');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateAccount();
    }
  };

  return (
    <div className="register-page-exact">
      <div className="register-container-exact">
        <div className="logo-section-exact">
          <h1 className="logo-exact">FinWall</h1>
        </div>
        
        <div className="register-section-exact">
          <div className="register-title-exact">Регистрация</div>
          
          {error && (
            <div className={`register-message ${error.includes('✅') ? 'success' : 'error'}`}>
              {error}
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
                placeholder="Придумайте логин"
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
                placeholder="Придумайте пароль"
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Добавляем подтверждение пароля */}
          <div className="input-row-exact">
            <span className="input-label-exact">Повторите пароль:</span>
            <div className="input-wrapper-exact">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                }}
                className="text-input-exact"
                placeholder="Повторите пароль"
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="buttons-container-exact">
          <div className="button-spacing-exact">
            <button 
              className="create-account-button-exact primary-button-exact"
              onClick={handleCreateAccount}
              disabled={loading || !login.trim() || !password.trim() || !confirmPassword.trim()}
            >
              {loading ? 'Создание...' : 'Создать аккаунт'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;