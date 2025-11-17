import { useState } from 'react';
import { api, setAuthToken, removeAuthToken } from '../../utils/api';

function WorkWithAccountBT({ accountData, action, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleAccountAction = async () => {
    setLoading(true);
    
    try {
      let result;
      
      if (action === 'login') {
        result = await api.login(accountData);
        if (result.success && result.data.token) {
          setAuthToken(result.data.token);
        }
      } else {
        result = await api.logout();
        removeAuthToken();
      }
      
      setLoading(false);
      
      if (result.success) {
        onSuccess({
          ...result.data,
          page: action === 'login' ? 'dashboard' : 'home'
        });
      } else {
        onCancel(result.data?.message || 'Ошибка операции');
      }
    } catch (error) {
      setLoading(false);
      onCancel('Ошибка соединения');
    }
  };

  return (
    <button 
      onClick={handleAccountAction}
      disabled={loading || !accountData}
      className={`btn ${action === 'login' ? 'btn-success' : 'btn-secondary'}`}
    >
      {loading ? 'Загрузка...' : (action === 'login' ? 'Войти' : 'Выйти')}
    </button>
  );
}

export default WorkWithAccountBT;