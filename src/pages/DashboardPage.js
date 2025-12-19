import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddExpenseModal from '../components/AddExpenseModal';
import { api, removeAuthToken, getAuthToken } from '../utils/api';
import './DashboardPage.css';

function DashboardPage({ onLogout }) {
  const navigate = useNavigate();
  
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyBills, setMonthlyBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateError, setDateError] = useState('');
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(30);
  
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddMonthlyModal, setShowAddMonthlyModal] = useState(false);
  const [modalType, setModalType] = useState('daily');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    
    await loadUserData();
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setDateError('');
      
      const categoriesResult = await api.getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      
      const expensesResult = await api.getExpenses();
      if (expensesResult.success) {
        setExpenses(expensesResult.data.dailyExpenses || []);
        setMonthlyExpenses(expensesResult.data.monthlyExpenses || []);
        setMonthlyBills(expensesResult.data.monthlyBills || []);
        setTotalThisMonth(expensesResult.data.totalThisMonth || 0);
        setDaysInMonth(expensesResult.data.daysInMonth || 30);
        
        if (expensesResult.data.currentDate) {
          setCurrentDate(new Date(expensesResult.data.currentDate));
        }
        
        const verifyResult = await api.verify({});
        if (verifyResult.success && verifyResult.data.user) {
          setUser(verifyResult.data.user);
        } else {
          handleLogout();
        }
      } else {
        if (expensesResult.status === 401) {
          handleLogout();
        } else {
          setDateError(expensesResult.error || 'Ошибка загрузки данных');
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setDateError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDate = async (direction) => {
    try {
      setLoading(true);
      const result = await api.changeTime(direction);
      
      if (result.success) {
        await loadUserData();
      } else {
        setDateError(result.error || 'Ошибка изменения даты');
        setLoading(false);
      }
    } catch (error) {
      console.error('Ошибка изменения даты:', error);
      setDateError('Ошибка соединения');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      removeAuthToken();
      if (onLogout) onLogout();
      navigate('/login', { replace: true });
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Транспорт': '🚗',
      'Продукты питания': '🍎',
      'Интернет': '🌐',
      'Телефонная связь': '📱',
      'Развлечения': '🎬',
      'Здоровье': '🏥',
      'Одежда': '👕',
      'Коммунальные услуги': '🏠',
      'Образование': '🎓',
      'Другое': '📦'
    };
    return icons[category] || '📦';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleAddExpense = (type = 'daily') => {
    setModalType(type);
    if (type === 'daily') {
      setShowAddExpenseModal(true);
    } else {
      setShowAddMonthlyModal(true);
    }
  };

  const handleAddNewExpense = async (newExpense) => {
    try {
      const result = await api.createExpense({
        ...newExpense,
        type: modalType
      });
      
      if (result.success) {
        await loadUserData();
        setShowAddExpenseModal(false);
        setShowAddMonthlyModal(false);
      } else {
        if (result.status === 401) {
          handleLogout();
        } else {
          alert(`Ошибка: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при добавлении затраты');
    }
  };

  const handleDeleteExpense = async (id, type) => {
    if (window.confirm('Удалить эту затрату?')) {
      try {
        const result = await api.deleteExpense(id);
        
        if (result.success) {
          await loadUserData();
        } else {
          if (result.status === 401) {
            handleLogout();
          } else {
            alert(`Ошибка: ${result.error}`);
          }
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении затраты');
      }
    }
  };

  const totalDaily = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalMonthly = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="dashboard-page-exact">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-exact">
      <div className="dashboard-container-exact">
        
        {/* Заголовок и дата */}
        <div className="header-section-exact">
          <h1 className="logo-exact">FinWall</h1>
          
          <div className="date-controls-exact">
            <button 
              className="date-button-exact"
              onClick={() => handleChangeDate('previous')}
              disabled={loading}
            >
              ←
            </button>
            
            <div className="current-date-exact">
              <div className="date-display">
                {formatDate(currentDate)}
                {isToday(currentDate) && <span className="today-badge"> (сегодня)</span>}
              </div>
              <div className="user-info">Пользователь: {user?.login || 'Неизвестно'}</div>
            </div>
            
            <button 
              className="date-button-exact"
              onClick={() => handleChangeDate('next')}
              disabled={loading}
            >
              →
            </button>
          </div>
          
          {dateError && (
            <div className="error-message-exact">{dateError}</div>
          )}
        </div>
        
        {/* Секция затрат за день */}
        <div className="section-exact expenses-section-exact">
          <h2 className="section-header-exact">Затраты за день:</h2>
          
          <div className="expenses-list-exact">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item-exact">
                <div className="expense-content-exact">
                  <span className="expense-icon-exact">{getCategoryIcon(expense.category)}</span>
                  <div className="expense-details-exact">
                    <span className="expense-category-exact">{expense.category}:</span>
                    <span className="expense-title-exact">{expense.title}</span>
                  </div>
                </div>
                <div className="expense-actions-exact">
                  <span className="expense-amount-exact">{expense.amount}P</span>
                  <button 
                    className="delete-btn-exact"
                    onClick={() => handleDeleteExpense(expense.id, 'daily')}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <div className="empty-state">
                {isToday(currentDate) 
                  ? 'Нет затрат за сегодня' 
                  : `Нет затрат за этот день`}
              </div>
            )}
          </div>
          
          {isToday(currentDate) && (
            <div className="button-wrapper-exact">
              <button 
                className="add-button-exact" 
                onClick={() => handleAddExpense('daily')}
                disabled={loading}
              >
                Добавить затраты
              </button>
            </div>
          )}
          
          <div className="total-section-exact">
            Итого за день: {totalDaily}P
            {!isToday(currentDate) && (
              <div className="date-note">(Просмотр исторических данных)</div>
            )}
          </div>
        </div>

        {/* Секция ежемесячных трат (разовые оплаты) */}
        <div className="section-exact monthly-section-exact">
          <h2 className="section-header-exact">Ежемесячные траты:</h2>
          
          <div className="monthly-explanation">
            Разовые оплаты за месяц (телефон, интернет, коммуналка и т.д.)
          </div>
          
          <div className="expenses-list-exact">
            {monthlyExpenses.map((expense) => (
              <div key={expense.id} className="expense-item-exact">
                <div className="expense-content-exact">
                  <span className="expense-icon-exact">{getCategoryIcon(expense.category)}</span>
                  <div className="expense-details-exact">
                    <span className="expense-category-exact">{expense.category}:</span>
                    <span className="expense-title-exact">{expense.title}</span>
                  </div>
                </div>
                <div className="expense-actions-exact">
                  <span className="expense-amount-exact">{expense.amount}P</span>
                  <button 
                    className="delete-btn-exact"
                    onClick={() => handleDeleteExpense(expense.id, 'monthly')}
                    title="Удалить"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            
            {monthlyExpenses.length === 0 && (
              <div className="empty-state">Нет ежемесячных трат</div>
            )}
          </div>
          
          <div className="button-wrapper-exact">
            <button 
              className="add-button-exact" 
              onClick={() => handleAddExpense('monthly')}
              disabled={loading}
            >
              Добавить ежемесячные траты
            </button>
          </div>
          
          <div className="total-section-exact">
            Ежемесячные фиксированные траты: {totalMonthly}P
          </div>
        </div>

        {/* ИСПРАВЛЕНИЕ: Правильный счёт за месяц */}
        <div className="section-exact bills-section-exact">
          <h2 className="section-header-exact">Счет за месяц:</h2>
          
          <div className="month-info">
            <div className="month-name">
              {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </div>
            <div className="bills-explanation">
              Затраты по дням + ежемесячные расходы
            </div>
          </div>
          
          {/* ИСПРАВЛЕНИЕ: Показываем счёт за каждый день */}
          <div className="daily-bills-container">
            <div className="daily-bills-header">
              <span>День</span>
              <span>Сумма</span>
            </div>
            
            <div className="daily-bills-list">
              {monthlyBills.map((bill, index) => {
                const day = index + 1;
                const amount = bill || 0;
                
                if (amount > 0) {
                  return (
                    <div key={index} className="daily-bill-item">
                      <span className="bill-day">{day} число:</span>
                      <span className="bill-amount">{amount}P</span>
                    </div>
                  );
                }
                return null;
              }).filter(Boolean)}
              
              {monthlyBills.filter(bill => bill > 0).length === 0 && (
                <div className="empty-state">Нет затрат в этом месяце</div>
              )}
            </div>
          </div>
          
          {/* ИСПРАВЛЕНИЕ: Ежемесячные расходы в общей сумме */}
          <div className="monthly-expenses-summary">
            {totalMonthly > 0 && (
              <div className="monthly-expense-item">
                <span>Ежемесячные расходы:</span>
                <span>{totalMonthly}P</span>
              </div>
            )}
          </div>
          
          <div className="month-total-exact">
            {/* ИСПРАВЛЕНИЕ: Общая сумма за текущий месяц = daily + monthly */}
            Итого за месяц: {totalThisMonth}P
          </div>
        </div>

        {/* Кнопка выхода */}
        <div className="logout-wrapper-exact">
          <button 
            className="logout-button-exact" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Выход...' : 'Выйти'}
          </button>
        </div>

      </div>

      {/* Модальные окна */}
      {showAddExpenseModal && (
        <AddExpenseModal
          onClose={() => setShowAddExpenseModal(false)}
          onAddExpense={handleAddNewExpense}
          categories={categories}
          type="daily"
        />
      )}

      {showAddMonthlyModal && (
        <AddExpenseModal
          onClose={() => setShowAddMonthlyModal(false)}
          onAddExpense={handleAddNewExpense}
          categories={categories}
          type="monthly"
        />
      )}
    </div>
  );
}

export default DashboardPage;