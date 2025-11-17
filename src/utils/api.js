// Базовый URL API (будет меняться в зависимости от среды)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Общая функция для отправки запросов
export const sendRequest = async (endpoint, data = {}, method = 'POST') => {
  try {
    const token = localStorage.getItem('authToken'); // Для авторизованных запросов
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    
    return { 
      success: response.ok, 
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message,
      status: 0
    };
  }
};

// Специализированные функции для разных типов запросов
export const api = {
  // Аутентификация
  login: (credentials) => sendRequest('/auth/login', credentials),
  register: (userData) => sendRequest('/auth/register', userData),
  logout: () => sendRequest('/auth/logout'),
  
  // Затраты
  getExpenses: () => sendRequest('/expenses', {}, 'GET'),
  createExpense: (expenseData) => sendRequest('/expenses', expenseData),
  updateExpense: (id, expenseData) => sendRequest(`/expenses/${id}`, expenseData, 'PUT'),
  deleteExpense: (id) => sendRequest(`/expenses/${id}`, {}, 'DELETE'),
  
  // Категории
  getCategories: () => sendRequest('/categories', {}, 'GET'),
  createCategory: (categoryData) => sendRequest('/categories', categoryData),
  deleteCategory: (id) => sendRequest(`/categories/${id}`, {}, 'DELETE'),
  
  // Время и навигация
  changeTime: (direction) => sendRequest('/time/change', { direction })
};

// Функция для установки токена
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Функция для получения токена
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Функция для удаления токена (выход)
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};