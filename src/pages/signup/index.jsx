import React from 'react';
import { Link } from 'react-router-dom';
import { signupUser } from './../../apiCalls/auth';
import toast, { Toaster } from 'react-hot-toast';
import bgImage from '../../assets/images/bg.jpg';

function Signup() {
  const [user, setUser] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  async function onFormSubmit(e) {
    e.preventDefault();

    try {
      const response = await signupUser(user);

      if (response.success) {
        toast.success('Signup successful!');
        setUser({ firstname: '', lastname: '', email: '', password: '' });
      } else {
        toast.error(response.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Signup error:', error);
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
          className="w-[770px] h-[550px] flex flex-col md:flex-row bg-black/70 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="hidden md:block md:w-1/2 bg-transparent" />

          <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md bg-transparent p-6 rounded-md">
              <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">Create Account</h1>

              <form className="space-y-5" onSubmit={onFormSubmit} noValidate>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
                  value={user.firstname}
                  onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                  required
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
                  value={user.lastname}
                  onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded bg-gray-200 text-black outline-none focus:ring-2 focus:ring-red-500"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition"
                >
                  Sign Up
                </button>
              </form>

              <p className="mt-6 text-center text-sm font-semibold text-red-600">
                Already have an account?
                <Link to="/login" className="text-white hover:underline ml-1">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
