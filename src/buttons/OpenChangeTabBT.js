import { useState } from 'react';
import { api } from '../../utils/api';

function OpenChangeTabBT({ dataType, onOpen, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleOpenTab = async () => {
    setLoading(true);
    
    const result = await api.openEdit({ dataType });
    
    setLoading(false);
    
    if (result.success) {
      onOpen(result.data);
    } else {
      onCancel(result.error || 'Ошибка открытия окна');
    }
  };

  return (
    <button 
      onClick={handleOpenTab}
      disabled={loading}
      className="btn btn-secondary"
    >
      {loading ? 'Открытие...' : `Редактировать ${dataType}`}
    </button>
  );
}

export default OpenChangeTabBT;