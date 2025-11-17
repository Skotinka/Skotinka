import { useState } from 'react';
import { api } from '../../utils/api';

function DeleteBT({ itemType, itemId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    
    const result = await api.deleteItem(itemType, itemId);
    
    setLoading(false);
    
    if (result.success) {
      onSuccess(result.data);
    } else {
      onCancel(result.error || 'Ошибка удаления');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-danger"
    >
      {loading ? 'Удаление...' : `Удалить ${itemType}`}
    </button>
  );
}

export default DeleteBT;