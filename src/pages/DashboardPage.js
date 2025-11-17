import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();

  // Данные точно как на картинке
  const expenses = [
    { category: 'Транспорт', amount: 150, icon: '🚗' },
    { category: 'Продукты питания', amount: 1043, icon: '🍎' }
  ];

  const monthlyExpenses = [
    { category: 'Интернет', amount: 520, icon: '🌐' },
    { category: 'Телефонная связь', amount: 300, icon: '📱' }
  ];

  const monthlyBills = [1672, 501, 302, 148, 2013, 900, 1333];

  const totalDaily = 1543; // Как на картинке
  const totalMonthly = 820; // Как на картинке
  const monthTotal = "N - K"; // Как на картинке

  const handleLogout = () => {
    navigate('/login');
  };

  const handleAddExpense = () => {
    console.log('Добавить затраты');
  };

  const handleAddMonthlyExpense = () => {
    console.log('Добавить ежемесячные траты');
  };

  return (
    <div className="dashboard-page-exact">
      <div className="dashboard-container-exact">
        
        {/* Секция затрат */}
        <div className="section-exact expenses-section-exact">
          <h2 className="section-header-exact">Затраты:</h2>
          
          <div className="expenses-list-exact">
            {expenses.map((expense, index) => (
              <div key={index} className="expense-item-exact">
                <div className="expense-content-exact">
                  <span className="expense-icon-exact">{expense.icon}</span>
                  <span className="expense-category-exact">{expense.category}:</span>
                </div>
                <span className="expense-amount-exact">{expense.amount}P</span>
              </div>
            ))}
          </div>
          
          <div className="button-wrapper-exact">
            <button className="add-button-exact" onClick={handleAddExpense}>
              Добавить затраты
            </button>
          </div>
          
          <div className="total-section-exact">
            Траты сегодня:{totalDaily}P
          </div>
        </div>

        {/* Секция ежемесячных трат */}
        <div className="section-exact monthly-section-exact">
          <h2 className="section-header-exact">Ежемесячные траты:</h2>
          
          <div className="expenses-list-exact">
            {monthlyExpenses.map((expense, index) => (
              <div key={index} className="expense-item-exact">
                <div className="expense-content-exact">
                  <span className="expense-icon-exact">{expense.icon}</span>
                  <span className="expense-category-exact">{expense.category}:</span>
                </div>
                <span className="expense-amount-exact">{expense.amount}P</span>
              </div>
            ))}
          </div>
          
          <div className="button-wrapper-exact">
            <button className="add-button-exact" onClick={handleAddMonthlyExpense}>
              Добавить ежемесячные траты
            </button>
          </div>
          
          <div className="total-section-exact">
            Ежемесячные траты:{totalMonthly}P
          </div>
        </div>

        {/* Секция счета за месяц */}
        <div className="section-exact bills-section-exact">
          <h2 className="section-header-exact">Счет за месяц:</h2>
          
          <div className="bills-list-exact">
            {monthlyBills.map((bill, index) => (
              <div key={index} className="bill-item-exact">
                {index + 1}. {bill}P
              </div>
            ))}
          </div>
          
          <div className="month-total-exact">
            Траты в этом месяце: {monthTotal}
          </div>
        </div>

        {/* Кнопка выхода */}
        <div className="logout-wrapper-exact">
          <button className="logout-button-exact" onClick={handleLogout}>
            Выйти
          </button>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;