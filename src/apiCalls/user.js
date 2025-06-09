import { axiosInstance } from './index';

export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get('/api/user/userdetail');
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/user/allUsers');
    return response.data;
  } catch (error) {
    return error;
  }
};
