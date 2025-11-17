import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Находим корневой элемент в public/index.html и рендерим в него наше приложение
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);