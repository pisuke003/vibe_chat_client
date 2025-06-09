import { axiosInstance } from './index';

export const getAllChats = async () => {
  try {
    const response = await axiosInstance.get('/api/chat/getallchats');  
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createNewChat = async (members) => {
  try {
    const response = await axiosInstance.post('/api/chat/createchat', { members });  
    return response.data;
  } catch (error) {
    return error;
  }
};
