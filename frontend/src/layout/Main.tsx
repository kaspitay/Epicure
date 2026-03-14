import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";
import { useAuthContext } from "../hooks/useAuthContext";
import { SidebarProvider, useSidebarContext } from "../context/SidebarContext";

const MainContent = () => {
  const { user } = useAuthContext();
  const { isExpanded } = useSidebarContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A]">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full z-20">
          <Sidebar />
        </div>

        {/* Main Content Area - responsive to sidebar */}
        <div
          className={`flex-1 h-full flex flex-col transition-all duration-300 ${
            isExpanded ? 'ml-[334px]' : 'ml-[80px]'
          }`}
        >
          {/* Header */}
          <header className="sticky top-0 z-10 bg-[#1E1C1A]/80 backdrop-blur-md border-b border-[#BE6F50]/20">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-white">
                  {user ? `Welcome back, ${user.user.name}` : 'Welcome to Epicure'}
                </h2>
              </div>
            </div>
          </header>

          {/* Content Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Main = () => {
  return (
    <SidebarProvider>
      <MainContent />
    </SidebarProvider>
  );
};

export default Main;
