// src/utils/errorHandler.js
import toast from 'react-hot-toast';

export const handleError = (error, setError = null) => {
  let errorMessage = 'An unexpected error occurred';

  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
    toast.error(errorMessage, {
      duration: 4000,
      position: 'top-right',
    });
  } else if (error?.message) {
    errorMessage = error.message;
    toast.error(errorMessage, {
      duration: 4000,
      position: 'top-right',
    });
  } else {
    toast.error(errorMessage, {
      duration: 4000,
      position: 'top-right',
    });
  }

  console.error('Error:', error);

  if (setError && typeof setError === 'function') {
    setError(errorMessage);
  }
  return errorMessage;
};
