import React, { useState } from 'react';
import './Modals.css';

function AddExpenseModal({ onClose, onAddExpense, categories, type = 'daily' }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Введите название';
    }
    
    if (!amount || amount <= 0) {
      newErrors.amount = 'Введите корректную сумму';
    }
    
    if (!category) {
      newErrors.category = 'Выберите категорию';
    }
    
    if (category === 'Другое' && !customCategory.trim()) {
      newErrors.customCategory = 'Введите название категории';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    const finalCategory = category === 'Другое' ? customCategory : category;
    
    onAddExpense({
      category: finalCategory,
      title: title.trim(),
      amount: parseInt(amount)
    });
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      'Транспорт': '🚗',
      'Продукты питания': '🍎',
      'Интернет': '🌐',
      'Телефонная связь': '📱',
      'Развлечения': '🎬',
      'Здоровье': '🏥',
      'Одежда': '👕',
      'Другое': '📦'
    };
    return icons[cat] || '📦';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Добавить {type === 'monthly' ? 'ежемесячные ' : ''}затраты</h3>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.title ? 'error' : ''}`}>
            <label htmlFor="title">Название:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({...errors, title: ''});
              }}
              placeholder="Например: Такси, Супермаркет"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          
          <div className={`form-group ${errors.amount ? 'error' : ''}`}>
            <label htmlFor="amount">Сумма (P):</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({...errors, amount: ''});
              }}
              placeholder="0"
              min="1"
              step="1"
            />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          
          <div className={`form-group ${errors.category ? 'error' : ''}`}>
            <label htmlFor="category">Категория:</label>
            <select 
              id="category"
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors({...errors, category: ''});
              }}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="category-option">
                  <span className="category-icon">{getCategoryIcon(cat)}</span>
                  {cat}
                </option>
              ))}
              <option value="Другое">📦 Другое</option>
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>
          
          {category === 'Другое' && (
            <div className={`form-group ${errors.customCategory ? 'error' : ''}`}>
              <label htmlFor="customCategory">Название новой категории:</label>
              <input
                id="customCategory"
                type="text"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  if (errors.customCategory) setErrors({...errors, customCategory: ''});
                }}
                placeholder="Введите название"
              />
              {errors.customCategory && (
                <span className="form-error">{errors.customCategory}</span>
              )}
            </div>
          )}
          
          <div className="modal-buttons">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="confirm-btn"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;