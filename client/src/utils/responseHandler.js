import toast from 'react-hot-toast';

export const handleResponse = (response, successMessage = null) => {
  if (response?.data) {
    if (successMessage) {
      toast.success(successMessage);
    }
    return response.data.data || response.data;
  }
  throw new Error('Invalid response format');
};

export const handleError = (error, setError) => {
  const errorMessage =
    error?.response?.data?.message || 'An unexpected error occurred';
  console.error(errorMessage);

  toast.error(errorMessage);
  if (setError) {
    setError(errorMessage);
  }
  throw new Error(errorMessage);
};
