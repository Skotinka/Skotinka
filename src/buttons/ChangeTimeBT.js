import { useState } from 'react';
import { api } from '../../utils/api';

function ChangeTimeBT({ direction, onTimeChange }) {
  const [loading, setLoading] = useState(false);

  const handleTimeChange = async () => {
    setLoading(true);
    
    const result = await api.changeTime(direction);
    
    setLoading(false);
    
    if (result.success) {
      onTimeChange(result.data);
    }
  };

  return (
    <button 
      onClick={handleTimeChange}
      disabled={loading}
      className="btn btn-secondary"
    >
      {loading ? '...' : (direction === 'next' ? '→' : '←')}
    </button>
  );
}

export default ChangeTimeBT;