import { useState } from 'react';
import { api } from '../../utils/api';

function ChooseCategoryBT({ expenseId, categoryName, onSelect, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleSelectCategory = async () => {
    setLoading(true);
    
    const result = await api.assignCategory({
      expenseId,
      categoryName
    });
    
    setLoading(false);
    
    if (result.success) {
      onSelect(result.data);
    } else {
      onCancel(result.error || 'Ошибка выбора категории');
    }
  };

  return (
    <button 
      onClick={handleSelectCategory}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Выбор...' : `Выбрать ${categoryName}`}
    </button>
  );
}

export default ChooseCategoryBT;