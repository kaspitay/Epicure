import { useState } from "react";
import { BiSolidLogIn } from "react-icons/bi";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaHome, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
export default function Menu() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Default user is logged in
  const { user } = useAuthContext();
  const creatorid = user ? user.user._id : null;
  const { logout } = useLogout();
  // Function to toggle user login status
  const toggleUserLogin = () => {
    setIsUserLoggedIn(!isUserLoggedIn);
  };
  const handleLogOut = (e) => {
    logout();
  };
  return (
    <div className="row-span-3   bg-[#1E1C1A] rounded-lg py-3 px-4">
      <div className="h-full ">
        {/* Logo */}
        <div className="flex items-center mb-2">
          {user ? (
            user.user.userType === 1 ? (
              <h1 className="text-[#BE6F50] text-[22px]">Epicure-Chef</h1>
            ) : (
              <h1 className="text-[#BE6F50] text-[22px]">Epicure</h1>
            )
          ) : (
            <h1 className="text-[#BE6F50] text-[22px]">Epicure</h1>
          )}{" "}
        </div>

        <div className="overflow-y-scroll max-h-[70%]  scrollbar-none">
          {/* Sidebar Links */}
          {user && (
            <Link to="/">
              <div className="sidebar-link-div">
                <FaHome className="w-5 h-5 mr-2 text-[#BE6F50]" />
                <h1 className="flex items-center text-white px-4 py-1">Home</h1>
              </div>
            </Link>
          )}

          {user && (
            <Link to="/search">
              <div className="sidebar-link-div">
                <FaSearch className="w-5 h-5 mr-2 text-[#BE6F50]" />
                <h1 className="flex items-center text-white px-4 py-1">
                  Search
                </h1>
              </div>
            </Link>
          )}

          {/* {user && user.user.userType === 1 ? ( */}
          {user && user.user.userType === 1 ? (
            <Link to={`/creator/${creatorid}`}>
              <div className="sidebar-link-div">
                <IoIosCreate className="w-5 h-5 mr-2 text-[#BE6F50]" />
                <h1 className="flex text-[14px] items-center text-white px-4 py-1">
                  My Kitchen
                </h1>
              </div>
            </Link>
          ) : null}

          {/* Login/Logout Button */}
          <div className="sidebar-link-div">
            {user ? (
              <div className="flex justify-center items-center">
                <RiLogoutBoxFill className="w-5 h-5 mr-2 text-[#BE6F50]" />
                <button
                  className="flex items-center text-white px-4 py-1"
                  onClick={handleLogOut}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <BiSolidLogIn className="w-5 h-5 text-[#BE6F50]" />
                <Link to="/login">
                  <h1 className="flex items-center text-white ml-2 px-4 py-1 rounded-lg">
                    LogIn
                  </h1>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
