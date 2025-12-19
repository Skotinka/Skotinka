import { mockBackend } from './mockBackend';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK_BACKEND = true;

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// ФИКС 4: Правильное удаление токена
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  // Также очищаем все связанные данные
  localStorage.removeItem('userData');
  localStorage.removeItem('lastLogin');
  console.log('Токен и данные удалены');
};

// ФИКС: Правильная функция для работы с датами
const getCurrentDateFromStorage = () => {
  const stored = localStorage.getItem('currentDate');
  return stored ? new Date(stored) : new Date();
};

const setCurrentDateToStorage = (date) => {
  localStorage.setItem('currentDate', date.toISOString());
};

const sendRequest = async (endpoint, data = {}, method = 'GET') => {
  console.log(`📡 ${method} ${endpoint}`, data);

  if (USE_MOCK_BACKEND) {
    return await sendMockRequest(endpoint, data, method);
  }

  return await sendRealRequest(endpoint, data, method);
};

const sendMockRequest = async (endpoint, data, method) => {
  const token = getAuthToken();
  
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    switch (endpoint) {
      case '/auth/login':
        return await mockBackend.login(data);
        
      case '/auth/register':
        return await mockBackend.register(data);
        
      case '/auth/verify':
        return await mockBackend.verifyToken(data.token || token);
        
      case '/auth/logout':
        // ФИКС 4: Сначала вызываем logout на бэкенде, потом очищаем локально
        const result = await mockBackend.logout(token);
        removeAuthToken();
        return result;
        
      case '/expenses':
        if (method === 'GET') {
          return await mockBackend.getUserData(token);
        } else if (method === 'POST') {
          return await mockBackend.addExpense(token, data);
        }
        break;
        
      case endpoint.match(/^\/expenses\/(\d+)$/)?.input:
        if (method === 'DELETE') {
          const id = parseInt(endpoint.split('/').pop());
          return await mockBackend.deleteExpense(token, id);
        }
        break;
        
      case '/categories':
        return {
          success: true,
          data: mockBackend.categories
        };
        
      case '/time/change':
        return await mockBackend.changeDate(token, data.direction);
        
      case '/navigation/change-page':
        return {
          success: true,
          data: { 
            message: 'Страница изменена',
            page: data.targetPage
          }
        };
        
      default:
        return {
          success: true,
          data: { 
            message: 'Мок-ответ',
            endpoint,
            data
          }
        };
    }
  } catch (error) {
    console.error('Mock API Error:', error);
    return {
      success: false,
      error: error.message,
      status: 500
    };
  }
};

const sendRealRequest = async (endpoint, data, method) => {
  console.warn('⚠️ Реальный бэкенд отключен');
  return await sendMockRequest(endpoint, data, method);
};

export const api = {
  login: (credentials) => sendRequest('/auth/login', credentials, 'POST'),
  register: (userData) => sendRequest('/auth/register', userData, 'POST'),
  verify: (credentials) => sendRequest('/auth/verify', credentials, 'POST'),
  logout: () => sendRequest('/auth/logout', {}, 'POST'),
  
  getExpenses: () => sendRequest('/expenses', {}, 'GET'),
  createExpense: (expenseData) => sendRequest('/expenses', expenseData, 'POST'),
  updateExpense: (id, expenseData) => sendRequest(`/expenses/${id}`, expenseData, 'PUT'),
  deleteExpense: (id) => sendRequest(`/expenses/${id}`, {}, 'DELETE'),
  
  getCategories: () => sendRequest('/categories', {}, 'GET'),
  createCategory: (categoryData) => sendRequest('/categories', categoryData, 'POST'),
  deleteCategory: (id) => sendRequest(`/categories/${id}`, {}, 'DELETE'),
  
  changeTime: (direction) => sendRequest('/time/change', { direction }, 'POST'),
  changePage: (pageData) => sendRequest('/navigation/change-page', pageData, 'POST'),
};

export { setAuthToken, getAuthToken, removeAuthToken };