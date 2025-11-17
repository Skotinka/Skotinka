import { useState } from 'react';
import { api } from '../../utils/api';

function ChangeExpense({ newData, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleSaveExpense = async () => {
    setLoading(true);
    
    const result = await api.updateExpense(newData);
    
    setLoading(false);
    
    if (result.success) {
      onSave(result.data);
    } else {
      onCancel(result.error || 'Ошибка сохранения');
    }
  };

  return (
    <div className="expense-actions">
      <button 
        onClick={handleSaveExpense}
        disabled={loading}
        className="btn btn-success"
      >
        {loading ? 'Сохранение...' : 'Сохранить счет'}
      </button>
      <button 
        onClick={() => onCancel('Отменено пользователем')}
        className="btn btn-secondary"
      >
        Отмена
      </button>
    </div>
  );
}

export default ChangeExpense;