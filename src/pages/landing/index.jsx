import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col">
      <nav className="w-full px-6 md:px-8 py-4 flex justify-between items-center bg-[#2E2E2E]">
        <div className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <i className="fa fa-comments text-red-500" aria-hidden="true"></i>
          ChatVibe
        </div>

        <div className="flex gap-3 md:gap-4">
          <Link to="/login">
            <button className="px-4 py-2 text-sm md:text-base bg-red-600 rounded hover:bg-red-700 transition">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 text-sm md:text-base border border-white rounded hover:bg-white hover:text-black transition">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          Connect. Chat. Collaborate.
        </h1>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl md:max-w-2xl mb-8">
          Welcome to ChatVibe — a clean and modern messaging experience where real-time conversation meets simplicity and style.
        </p>
        <Link to="/signup">
          <button className="px-6 py-3 text-sm sm:text-base bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition">
            Get Started Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
