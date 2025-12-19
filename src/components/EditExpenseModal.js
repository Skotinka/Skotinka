import React, { useState, useEffect } from 'react';
import './Modals.css';

function EditExpenseModal({ expense, onClose, onSave, categories }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setTitle(expense.title || '');
      setAmount(expense.amount || '');
      setCategory(expense.category || '');
    }
  }, [expense]);

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
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    onSave({
      ...expense,
      title: title.trim(),
      amount: parseInt(amount),
      category
    });
  };

  if (!expense) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Редактировать затрату</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.title ? 'error' : ''}`}>
            <label>Название:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({...errors, title: ''});
              }}
              placeholder="Название"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>
          
          <div className={`form-group ${errors.amount ? 'error' : ''}`}>
            <label>Сумма (P):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({...errors, amount: ''});
              }}
              placeholder="0"
              min="1"
            />
            {errors.amount && <span className="form-error">{errors.amount}</span>}
          </div>
          
          <div className={`form-group ${errors.category ? 'error' : ''}`}>
            <label>Категория:</label>
            <select 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors({...errors, category: ''});
              }}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>
          
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="confirm-btn">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpenseModal;