import { useState } from 'react';
import { api } from '../../utils/api';

function CreateAccountBT({ login, password, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!login || !password) {
      onCancel('Заполните все поля');
      return;
    }

    setLoading(true);
    
    const result = await api.register({ login, password });
    
    setLoading(false);
    
    if (result.success) {
      onSuccess(result.data);
    } else {
      onCancel(result.data?.message || 'Ошибка создания аккаунта');
    }
  };

  return (
    <button 
      onClick={handleCreateAccount}
      disabled={loading}
      className="btn btn-success"
    >
      {loading ? 'Создание...' : 'Создать аккаунт'}
    </button>
  );
}

export default CreateAccountBT;