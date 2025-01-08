import Menu from "./Menu";
import CookBooks from "./CookBooks";
import Chefs from "./Chefs";

const Sidebar = () => {
  return (
    <div className=" sm:w-[290px] md:w-[300px] lg:w-[334px] block ">
      <div className="h-full grid grid-rows-12 gap-2 p-2">
        <Menu />
        <CookBooks />
        <Chefs />
      </div>
    </div>
  );
};

export default Sidebar;
