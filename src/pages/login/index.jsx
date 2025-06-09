import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from './../../apiCalls/auth'; 
import toast, { Toaster } from 'react-hot-toast';
import bgImage from '../../assets/images/bg.jpg';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUserState] = React.useState({
    email: '',
    password: '',
  });

  async function onFormSubmit(e) {
    e.preventDefault();
    try {
      const response = await loginUser(user);

      if (response.success) {
        toast.success('Login successful!');
       


        dispatch(setUser(response.user));

      
        localStorage.setItem('token',response.token);
            navigate('/home');

      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <nav className="w-full px-6 md:px-8 py-4 flex justify-between items-center bg-[#2E2E2E]">
        <div className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <i className="fa fa-comments text-red-500" aria-hidden="true"></i>
          ChatVibe
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-12">
      <div
  className="w-[700px] h-[400px] flex flex-col md:flex-row bg-black/70 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg overflow-hidden"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  {/* Left image side (you can also put an overlay or logo here) */}
  <div className="hidden md:block md:w-1/2" />

  {/* Right login form side */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-8">
    <div className="w-full max-w-md bg-transparent p-6 rounded-md">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Login</h1>

      <form className="space-y-5" onSubmit={onFormSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
          value={user.email}
          onChange={(e) => setUserState({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
          value={user.password}
          onChange={(e) => setUserState({ ...user, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm font-semibold text-red-600">
        Don’t have an account?
        <Link to="/signup" className="text-white hover:underline ml-1">
          Sign Up Here
        </Link>
      </p>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}

export default Login;
