import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/userSlice";

function Header() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getInitials = () => {
    const f = user?.firstname?.[0]?.toUpperCase() || "";
    const l = user?.lastname?.[0]?.toUpperCase() || "";
    return f + l;
  };

  const getFullName = () => {
    if (!user?.firstname || !user?.lastname) return "";
    const fname =
      user.firstname.charAt(0).toUpperCase() +
      user.firstname.slice(1).toLowerCase();
    const lname =
      user.lastname.charAt(0).toUpperCase() +
      user.lastname.slice(1).toLowerCase();
    return `${fname} ${lname}`;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 md:px-8 border-b border-gray-700 bg-[#1f1f1f] text-white">
      <div className="flex items-center text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap">
        <i className="fa fa-comments mr-2" aria-hidden="true"></i>
        ChatVibe
      </div>

      <div className="flex items-center gap-3 sm:gap-4 min-w-[120px] max-w-full flex-shrink-0">
        <div className="text-white font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]">
          {getFullName()}
        </div>

        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white text-sm sm:text-lg font-bold flex items-center justify-center select-none">
          {getInitials()}
        </div>

        <button
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="p-2 rounded text-red-500 hover:text-white hover:bg-red-700 transition"
        >
          <i className="fa fa-sign-out" />
        </button>
      </div>
    </div>
  );
}

export default Header;
