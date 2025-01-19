import axiosInstance from '../services/axiosInstance';

const uploadFile = async (
  file,
  onUploadProgress,
  folder = 'general',
  resourceType = 'auto'
) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);

    const response = await axiosInstance.put(
      '/auth/update-profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      }
    );
    return response.data.data.profileImage; // Return the secure URL
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw for higher-level handling
  }
};

export default uploadFile;