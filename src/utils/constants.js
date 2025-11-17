// Константы приложения
export const APP_CONSTANTS = {
  // Типы затрат
  EXPENSE_TYPES: {
    ONE_TIME: 'one-time',
    MONTHLY: 'monthly'
  },
  
  // Направления смены времени
  TIME_DIRECTIONS: {
    PREVIOUS: 'previous',
    NEXT: 'next'
  },
  
  // Типы данных для редактирования
  DATA_TYPES: {
    PROFILE: 'profile',
    EXPENSE: 'expense',
    CATEGORY: 'category',
    SETTINGS: 'settings'
  },
  
  // Страницы приложения
  PAGES: {
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'dashboard',
    PROFILE: 'profile'
  }
};

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка соединения с сервером',
  UNAUTHORIZED: 'Необходима авторизация',
  INVALID_CREDENTIALS: 'Неверный логин или пароль',
  USER_EXISTS: 'Пользователь с таким логином уже существует'
};