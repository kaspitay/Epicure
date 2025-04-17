import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BiSolidLogIn } from "react-icons/bi";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaHome, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Menu({ isExpanded, expandSidebar }) {
  const { user } = useAuthContext();
  const creatorid = user ? user.user._id : null;
  const { logout } = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogOutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedTags.length > 0) {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (selectedTags.length > 0) queryParams.append('tags', selectedTags.join(','));
      navigate(`/search?${queryParams.toString()}`);
    }
  };

  const menuItems = [
    { path: "/", icon: FaHome, label: "Home", show: !!user },
    { path: "/search", icon: FaSearch, label: "Search", show: !!user },
    { 
      path: `/creator/${creatorid}`, 
      icon: IoIosCreate, 
      label: "My Kitchen", 
      show: user?.user?.userType === 1 
    }
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-[#1E1C1A] rounded-lg py-4 ${isExpanded ? 'px-4' : 'px-2'}`}
      >
        <div className="h-full">
          {/* Logo */}
          {isExpanded ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex items-center mb-6"
            >
              {user ? (
                user.user.userType === 1 ? (
                  <h1 className="text-[#BE6F50] text-2xl font-bold tracking-wide">Epicure-Chef</h1>
                ) : (
                  <h1 className="text-[#BE6F50] text-2xl font-bold tracking-wide">Epicure</h1>
                )
              ) : (
                <h1 className="text-[#BE6F50] text-2xl font-bold tracking-wide">Epicure</h1>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex items-center justify-center mb-6"
            >
              <span className="text-[#BE6F50] text-2xl font-bold">E</span>
            </motion.div>
          )}

          <div className="space-y-2">
            {/* Sidebar Links */}
            {menuItems.map((item, index) => (
              item.show && (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={item.path} onClick={!isExpanded ? expandSidebar : undefined}>
                    <div 
                      className={`sidebar-link-div ${isActive(item.path) ? 'bg-[#BE6F50] bg-opacity-10' : ''} ${
                        !isExpanded ? 'justify-center px-2 py-2' : ''
                      }`}
                      title={!isExpanded ? item.label : ''}
                    >
                      <item.icon className={`w-5 h-5 ${isExpanded ? 'mr-2' : ''} text-[#BE6F50]`} />
                      {isExpanded && <span className="text-white font-medium">{item.label}</span>}
                    </div>
                  </Link>
                </motion.div>
              )
            ))}

            {/* Login/Logout Button */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {user ? (
                <button
                  onClick={handleLogOutClick}
                  className={`w-full sidebar-link-div hover:bg-[#BE6F50] hover:bg-opacity-20 transition-colors duration-200 ${
                    !isExpanded ? 'justify-center px-2 py-2' : ''
                  }`}
                  title={!isExpanded ? 'Log out' : ''}
                >
                  <div className={`flex items-center ${!isExpanded ? 'justify-center' : ''}`}>
                    <RiLogoutBoxFill className={`w-5 h-5 ${isExpanded ? 'mr-2' : ''} text-[#BE6F50]`} />
                    {isExpanded && <span className="text-white font-medium">Log out</span>}
                  </div>
                </button>
              ) : (
                <Link to="/login" className="block">
                  <div className={`sidebar-link-div hover:bg-[#BE6F50] hover:bg-opacity-20 transition-colors duration-200 ${
                    !isExpanded ? 'justify-center px-2 py-2' : ''
                  }`}
                  title={!isExpanded ? 'Login' : ''}
                  >
                    <div className={`flex items-center ${!isExpanded ? 'justify-center' : ''}`}>
                      <BiSolidLogIn className={`w-5 h-5 ${isExpanded ? 'mr-2' : ''} text-[#BE6F50]`} />
                      {isExpanded && <span className="text-white font-medium">Login</span>}
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}
