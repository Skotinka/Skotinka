import { useState } from 'react';
import { api } from '../../utils/api';

function CreatePayBT({ payType, title, category, amount, onCreate, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleCreatePay = async () => {
    if (!title || !amount) {
      onCancel('Заполните обязательные поля');
      return;
    }

    setLoading(true);
    
    const result = await api.createPayment({
      type: payType,
      title,
      category,
      amount: parseFloat(amount)
    });
    
    setLoading(false);
    
    if (result.success) {
      onCreate(result.data);
    } else {
      onCancel(result.data?.message || 'Ошибка создания затраты');
    }
  };

  return (
    <button 
      onClick={handleCreatePay}
      disabled={loading}
      className="btn btn-success"
    >
      {loading ? 'Создание...' : `Создать ${payType === 'monthly' ? 'ежемесячную ' : ''}затрату`}
    </button>
  );
}

export default CreatePayBT;