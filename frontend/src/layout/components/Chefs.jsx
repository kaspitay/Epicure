import { LuChefHat } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Chefs() {
  const { user } = useAuthContext();

  const renderChefs = () => {
    // Check if user is defined
    if (!user || !user.user.chefs) {
      return null; // If user is undefined, return null
    }

    // Render chef links
    const chefs = user.user.chefs;
    const chefLinks = chefs.map((chef, index) => (
      <Link
        to={`/creator/${chef.ccId}`}
        key={`chef-${index}`}
        className="sidebar-link"
      >
        {chef.ccName} {/* Assuming each chef has a 'name' property */}
      </Link>
    ));
    return chefLinks;
  };

  return (
    <div className="row-span-5 w-full bg-[#1E1C1A] rounded-lg py-5 px-4 ">
      {/* Chefs Header */}
      <div className="flex gap-2 items-center mb-4">
        <LuChefHat className="text-[#BE6F50] text-xl" />
        <span className="text-lg font-bold text-white">Your Chefs</span>
      </div>

      {/* Scrollable Container for Chefs */}
      {user !== null ? (
        <>
          <div className="overflow-y-auto max-h-[80%] scrollbar-none scrollbar-thumb-gray-500 scrollbar-track-gray-800 flex flex-col gap-3">
            {renderChefs()}
          </div>
        </>
      ) : (
        <h1 className="text-white text-sm ">Please login to view your chefs</h1>
      )}
    </div>
  );
}
