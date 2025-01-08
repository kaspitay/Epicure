import { Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar";

const Main = () => {
  return (
    <div className="h-screen bg-[#000000]">
      {/* Main Container */}
      <div className="flex w-full h-full overflow-hidden">
        {/* Sidebar */}
          <Sidebar />
        {/* Content */}
        <div className="w-full h-full pr-2 py-2 rounded-lg bg-[#000000]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
