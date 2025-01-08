import { useState, useEffect } from "react";
import { FaThumbsUp, FaEye, FaCalendarDay } from "react-icons/fa";

const Statistics = () => {
  // Dummy data for demonstration
  const [likes, setLikes] = useState(1000);
  const [totalViews, setTotalViews] = useState(50000);
  const [newViewsToday, setNewViewsToday] = useState(2000);
  const [newLikesToday, setNewLikesToday] = useState(50);

  // Fetching data from the database (dummy useEffect)
  useEffect(() => {
    // Dummy fetch data from the database
    // For demonstration purposes, we'll just set some random values after a timeout
    const fetchData = () => {
      setTimeout(() => {
        setLikes(1500);
        setTotalViews(55000);
        setNewViewsToday(2500);
        setNewLikesToday(100);
      }, 2000); // Simulating network delay
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-y-auto xl:max-w-lg max-h-96 mb-28">
      <div className="h-full rounded-lg shadow-lg">
        {/* Title */}
        <h1 className="text-white text-3xl mb-5">Statistics</h1>

        {/* Likes */}
        <div className="flex items-center justify-between border border-gray-500 bg-[#272727] rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <FaThumbsUp className="text-xl text-blue-500 mr-2" />
            <span className="text-xl text-white font-semibold">
              Likes
            </span>
          </div>
          <span className="text-xl text-white font-semibold">
            {likes}
          </span>
        </div>

        {/* Total Views */}
        <div className="flex items-center justify-between border border-gray-500 bg-[#272727] rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <FaEye className="text-xl text-yellow-500 mr-2" />
            <span className="text-xl text-white font-semibold">
              Total Views
            </span>
          </div>
          <span className="text-xl text-white font-semibold">
            {totalViews}
          </span>
        </div>

        {/* New Views Today */}
        <div className="flex items-center justify-between border border-gray-500 bg-[#272727] rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <FaCalendarDay className="text-xl text-green-500 mr-2" />
            <span className="text-xl text-white font-semibold">
              New Views Today
            </span>
          </div>
          <span className="text-xl text-white font-semibold">
            {newViewsToday}
          </span>
        </div>

        {/* New Likes Today */}
        <div className="flex items-center justify-between border border-gray-500 bg-[#272727] rounded-lg p-4 mb-4">
          <div className="flex gap-2">
            <FaThumbsUp className="text-xl text-red-500 mr-2" />
            <span className="text-xl text-white font-semibold">
              New Likes Today
            </span>
          </div>
          <span className="text-xl text-white font-semibold">
            {newLikesToday}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
