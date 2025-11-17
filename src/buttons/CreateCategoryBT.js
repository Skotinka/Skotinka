import { useState } from 'react';
import { api } from '../../utils/api';

function CreateCategoryBT({ categoryName, onCreate, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (!categoryName) {
      onCancel('Введите название категории');
      return;
    }

    setLoading(true);
    
    const result = await api.createCategory({ name: categoryName });
    
    setLoading(false);
    
    if (result.success) {
      onCreate(result.data);
    } else {
      onCancel(result.data?.message || 'Ошибка создания категории');
    }
  };

  return (
    <button 
      onClick={handleCreateCategory}
      disabled={loading}
      className="btn btn-success"
    >
      {loading ? 'Создание...' : 'Создать категорию'}
    </button>
  );
}

export default CreateCategoryBT;