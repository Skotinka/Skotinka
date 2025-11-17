import { useState } from 'react';
import { api } from '../../utils/api';

function NoBT({ onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    
    const result = await api.cancel();
    
    setLoading(false);
    
    onCancel(result.success ? 'Действие отменено' : 'Ошибка отмены');
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={loading}
      className="btn btn-secondary"
    >
      {loading ? 'Отмена...' : 'Нет'}
    </button>
  );
}

export default NoBT;