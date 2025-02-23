import axiosInstance from './axiosInstance';
import { handleResponse, handleError } from '../utils/responseHandler';
import uploadFile from '../utils/fileUploadHandler';

export const postData = async (url, data, successMessage = null) => {
  try {
    const response = await axiosInstance.post(url, data);
     return handleResponse(response, successMessage);
  } catch (error) {
    handleError(error);
     throw error;
  }
};

export const getData = async url => {
  try {
    const response = await axiosInstance.get(url);
     return handleResponse(response);

  } catch (error) {
       handleError(error);
     throw error;
  }
};

export const deleteData = async url => {
  try {
    const response = await axiosInstance.delete(url);
     return handleResponse(response);
  } catch (error) {
       handleError(error);
      throw error;
  }
};


export const putData = async (url, data, successMessage = null) => {
  try {
    const response = await axiosInstance.put(url, data);
    
    return handleResponse(response, successMessage);
  } catch (error) {
     handleError(error);
    throw error;
  }
};


export const uploadFileToCloudinary = async (
  file,
  onUploadProgress,
  folder,
  resourceType
) => {
    try {
        const uploadedImageUrl = await uploadFile(
            file,
            onUploadProgress,
            folder,
            resourceType
        );
        return uploadedImageUrl;
    } catch (error) {
        handleError(error);
        throw error;
    }
};