class MockBackend {
  constructor() {
    this.users = [];
    this.expenses = [];
    this.sessions = new Map();
    this.currentDates = new Map();
    
    this.categories = ['Транспорт', 'Продукты питания', 'Интернет', 'Телефонная связь', 'Развлечения', 'Здоровье', 'Одежда', 'Коммунальные услуги', 'Образование', 'Другое'];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateToken(userId) {
    return `mock-token-${userId}-${Date.now()}`;
  }

  checkSession(token) {
    if (!token || !this.sessions.has(token)) {
      return null;
    }
    return this.sessions.get(token);
  }

  async changeDate(token, direction) {
    await this.delay();
    
    const session = this.checkSession(token);
    if (!session) {
      return {
        success: false,
        error: 'Не авторизован',
        status: 401
      };
    }

    let currentDate = this.currentDates.get(token) || new Date();
    const newDate = new Date(currentDate);
    
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (direction === 'previous') {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    this.currentDates.set(token, newDate);
    session.currentDate = newDate.toISOString();

    return {
      success: true,
      data: {
        message: 'Дата изменена',
        newDate: newDate.toISOString(),
        formattedDate: this.formatDate(newDate)
      }
    };
  }

  async login(credentials) {
    await this.delay();
    
    const user = this.users.find(u => 
      u.login === credentials.login && 
      u.password === credentials.password
    );

    if (user) {
      const token = this.generateToken(user.id);
      const currentDate = new Date();
      
      this.sessions.set(token, { 
        userId: user.id,
        loginTime: new Date().toISOString(),
        currentDate: currentDate.toISOString()
      });
      
      this.currentDates.set(token, currentDate);
      
      return {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            login: user.login
          }
        }
      };
    }

    return {
      success: false,
      error: 'Неверный логин или пароль',
      status: 401
    };
  }

  async register(userData) {
    await this.delay();
    
    if (this.users.some(u => u.login === userData.login)) {
      return {
        success: false,
        error: 'Пользователь с таким логином уже существует',
        status: 409
      };
    }

    const newUser = {
      id: this.users.length + 1,
      login: userData.login,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    
    this.users.push(newUser);
    
    const token = this.generateToken(newUser.id);
    const currentDate = new Date();
    
    this.sessions.set(token, { 
      userId: newUser.id,
      loginTime: new Date().toISOString(),
      currentDate: currentDate.toISOString()
    });
    
    this.currentDates.set(token, currentDate);

    return {
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          login: newUser.login
        }
      }
    };
  }

  async verifyToken(token) {
    await this.delay(100);
    
    const session = this.checkSession(token);
    if (session) {
      const user = this.users.find(u => u.id === session.userId);
      
      return {
        success: true,
        data: {
          isValid: true,
          user: user ? { 
            id: user.id, 
            login: user.login
          } : null
        }
      };
    }

    return {
      success: false,
      error: 'Недействительный токен',
      status: 401
    };
  }

  // ИСПРАВЛЕНИЕ: Правильный счёт за месяц
  async getUserData(token) {
    await this.delay();
    
    const session = this.checkSession(token);
    if (!session) {
      return {
        success: false,
        error: 'Не авторизован',
        status: 401
      };
    }

    const currentDate = this.currentDates.get(token) || new Date();
    const dateStr = currentDate.toISOString().split('T')[0];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // 1. Расходы для текущего дня
    const dailyExpenses = this.expenses.filter(
      exp => exp.userId === session.userId && 
             exp.type === 'daily' && 
             exp.date === dateStr
    );

    // 2. Ежемесячные расходы (разовые оплаты)
    const monthlyExpenses = this.expenses.filter(
      exp => exp.userId === session.userId && exp.type === 'monthly'
    );

    // 3. ИСПРАВЛЕНИЕ: Создаем счёт за каждый день месяца
    // Получаем все daily расходы за текущий месяц
    const currentMonthExpenses = this.expenses.filter(exp => {
      if (exp.userId !== session.userId || exp.type !== 'daily') return false;
      
      try {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && 
               expDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    });
    
    // Суммируем расходы по дням
    const expensesByDay = new Map();
    currentMonthExpenses.forEach(exp => {
      const day = new Date(exp.date).getDate();
      const currentAmount = expensesByDay.get(day) || 0;
      expensesByDay.set(day, currentAmount + exp.amount);
    });
    
    // Создаем массив счетов за каждый день месяца
    const monthlyBills = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const amount = expensesByDay.get(day) || 0;
      monthlyBills.push({
        day: day,
        amount: amount
      });
    }
    
    // ИСПРАВЛЕНИЕ: Берем ВСЕ дни месяца, а не только последние 7
    const allBills = monthlyBills.map(bill => bill.amount);

    // 4. Рассчитываем общие суммы
    const totalDailyExpenses = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // ИСПРАВЛЕНИЕ: Общая сумма за месяц = все daily расходы + ежемесячные разовые расходы
    const totalDailyThisMonth = Array.from(expensesByDay.values())
      .reduce((sum, amount) => sum + amount, 0);
    const totalThisMonth = totalDailyThisMonth + totalMonthlyExpenses;

    return {
      success: true,
      data: {
        dailyExpenses,
        monthlyExpenses,
        monthlyBills: allBills, // Все дни месяца
        categories: this.categories,
        currentDate: dateStr,
        currentMonth: currentMonth,
        currentYear: currentYear,
        daysInMonth: daysInMonth,
        totalThisMonth: totalThisMonth,
        totalDailyExpenses: totalDailyExpenses,
        totalMonthlyExpenses: totalMonthlyExpenses,
        totalDailyThisMonth: totalDailyThisMonth
      }
    };
  }

  async addExpense(token, expenseData) {
    await this.delay();
    
    const session = this.checkSession(token);
    if (!session) {
      return {
        success: false,
        error: 'Не авторизован',
        status: 401
      };
    }

    const currentDate = this.currentDates.get(token) || new Date();
    const dateStr = currentDate.toISOString().split('T')[0];
    
    const newExpense = {
      id: Date.now(),
      userId: session.userId,
      ...expenseData,
      date: dateStr,
      createdAt: new Date().toISOString()
    };

    this.expenses.push(newExpense);

    return {
      success: true,
      data: newExpense
    };
  }

  async deleteExpense(token, expenseId) {
    await this.delay();
    
    const session = this.checkSession(token);
    if (!session) {
      return {
        success: false,
        error: 'Не авторизован',
        status: 401
      };
    }

    const index = this.expenses.findIndex(
      exp => exp.id === expenseId && exp.userId === session.userId
    );

    if (index !== -1) {
      this.expenses.splice(index, 1);
      return {
        success: true,
        data: { 
          message: 'Затрата удалена', 
          deletedId: expenseId
        }
      };
    }

    return {
      success: false,
      error: 'Затрата не найдена',
      status: 404
    };
  }

  async logout(token) {
    await this.delay();
    
    this.sessions.delete(token);
    this.currentDates.delete(token);
    
    return {
      success: true,
      data: { message: 'Вы вышли из системы' }
    };
  }

  formatDate(date) {
    const options = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('ru-RU', options);
  }
}

export const mockBackend = new MockBackend();