import { useState } from 'react';
import { api } from '../../utils/api';

function CheckLogPasBT({ login, password, onApprove, onDeny }) {
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!login || !password) {
      onDeny('Заполните все поля');
      return;
    }

    setLoading(true);
    
    const result = await api.verify({ login, password });
    
    setLoading(false);
    
    if (result.success && result.data.isValid) {
      onApprove(result.data);
    } else {
      onDeny(result.data?.message || 'Неверные данные');
    }
  };

  return (
    <button 
      onClick={handleCheck}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Проверка...' : 'Проверить'}
    </button>
  );
}

export default CheckLogPasBT;