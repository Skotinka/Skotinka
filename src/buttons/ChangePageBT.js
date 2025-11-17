import { useState } from 'react';
import { api } from '../../utils/api';

function ChangePageBT({ targetPage, onPageChange, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleChangePage = async () => {
    setLoading(true);
    
    const result = await api.changePage({ targetPage });
    
    setLoading(false);
    
    if (result.success) {
      onPageChange(result.data);
    } else {
      onCancel(result.error || 'Ошибка смены страницы');
    }
  };

  return (
    <button 
      onClick={handleChangePage}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Переход...' : `Перейти на ${targetPage}`}
    </button>
  );
}

export default ChangePageBT;