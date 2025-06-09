import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser, getAllUsers } from './../apiCalls/user';
import { getAllChats } from './../apiCalls/chat';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setAllUsers, setAllChats } from '../redux/userSlice';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);


  const fetchLoggedUser = async () => {
    try {
      const response = await getLoggedUser();
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };
  const fetchAllUser = async () => {
    let response = null;
    try {
      response = await getAllUsers();
      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  }


  const fetchAllChats = async () => {
    let response = null;
    try {
      response = await getAllChats();
      if (response.success) {

        dispatch(setAllChats(response.data));
      } else {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchLoggedUser();
      fetchAllUser();
      fetchAllChats();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
