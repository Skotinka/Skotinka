import { useState } from 'react';
import { api } from '../../utils/api';

function YesBT({ changedData, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    
    const result = await api.confirm(changedData);
    
    setLoading(false);
    
    if (result.success) {
      onConfirm(result.data);
    } else {
      onCancel(result.error || 'Ошибка подтверждения');
    }
  };

  return (
    <button 
      onClick={handleConfirm}
      disabled={loading}
      className="btn btn-success"
    >
      {loading ? 'Подтверждение...' : 'Да'}
    </button>
  );
}

export default YesBT;