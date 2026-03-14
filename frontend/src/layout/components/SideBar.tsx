import Menu from "./Menu";
import CookBooks from "./CookBooks";
import Chefs from "./Chefs";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { LuChefHat } from "react-icons/lu";
import { useSidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { isExpanded, toggleSidebar, setIsExpanded } = useSidebarContext();

  const expandSidebar = () => {
    setIsExpanded(true);
  };

  return (
    <div className={`${isExpanded ? 'w-[334px]' : 'w-[80px]'} h-screen bg-[#1E1C1A] shadow-2xl border-r border-[#BE6F50]/10 relative transition-all duration-300`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#1E1C1A] p-2 rounded-full border border-[#BE6F50]/20 hover:bg-[#BE6F50]/10 transition-colors duration-200 shadow-lg"
      >
        {isExpanded ? <FaChevronLeft className="text-[#BE6F50]" /> : <FaChevronRight className="text-[#BE6F50]" />}
      </button>

      <div className="h-full flex flex-col gap-4 p-4 overflow-hidden">
        <Menu isExpanded={isExpanded} expandSidebar={expandSidebar} />
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#BE6F50] scrollbar-track-transparent">
          {isExpanded ? (
            <>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                >
                  <CookBooks isExpanded={isExpanded} />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                >
                  <Chefs isExpanded={isExpanded} />
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="sidebar-icon-container">
                <div
                  className="sidebar-icon cursor-pointer"
                  title="Cookbooks"
                  onClick={expandSidebar}
                >
                  <ImBooks className="text-xl" />
                </div>
              </div>
              <div className="sidebar-icon-container">
                <div
                  className="sidebar-icon cursor-pointer"
                  title="Chefs"
                  onClick={expandSidebar}
                >
                  <LuChefHat className="text-xl" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
