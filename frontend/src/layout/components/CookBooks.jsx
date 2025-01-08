import { FaPlus } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate, useMatch } from "react-router-dom";

import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "./../../config"; // Adjust the path as needed

export default function CookBooks() {
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const match = useMatch("/cook_books/:id/:title");
  const [showContent, setShowContent] = useState(true); // State variable to track visibility
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleContent = () => {
    setShowContent(!showContent); // Toggle visibility state
    setError(false); // Reset error state
  };

  const deleteCookbook = async (name) => {
    const cookbookName = name;
    try {
      const response = await axios.delete(`${BASE_URL}/user/cookbook`, {
        data: { name: cookbookName, user: user.user },
      });

      if (response.status === 201) {
        const updatedUser = response.data;
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (match && match.params.title === name) {
          navigate("/"); // Navigate to home page
        }
      } else {
        console.error("Error deleting cookbook:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeNewCookbook = async (e) => {
    e.preventDefault();

    if (!e.target.cookbookName.value) {
      setErrorMessage("Please enter a cookbook name");
      setError(true);
      return;
    }
    const cookbookName = e.target.cookbookName.value;

    const cookbookExists = user.user.books.some(
      (cookbook) => cookbook.name === cookbookName
    );
    if (cookbookExists || cookbookName === "favorites") {
      setErrorMessage("Cookbook already exists");
      setError(true);
      return;
    }
    setError(false);

    try {
      const response = await axios.post(`${BASE_URL}/user/cookbook`, {
        name: cookbookName,
        user: user.user,
      });

      if (response.status === 201) {
        const updatedUser = response.data;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        dispatch({ type: "UPDATE_USER", payload: updatedUser });

        e.target.cookbookName.value = "";
        toggleContent();
      } else {
        console.error("Error creating new cookbook:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCookbooks = () => {
    if (!user) {
      return null;
    }

    const cookbookLinks = user.user.books.map((cookbook, index) => {
      const truncatedName =
        cookbook.name.length > 10
          ? `${cookbook.name.slice(0, 10)}...`
          : cookbook.name;

      return (
        <div className="sidebar-link">
          <Link
            to={`/cook_books/${cookbook._id}/${cookbook.name}`}
            key={`cookbook-${cookbook._id}`}
            className="sidebar-link"
          >
            {truncatedName}
          </Link>
          <button onClick={() => deleteCookbook(cookbook.name)}>
            <FaTrashAlt className="text-white" />
          </button>
        </div>
      );
    });
    return [...cookbookLinks];
  };

  return (
    <div className="row-span-4 w-full bg-[#1E1C1A] rounded-lg py-5 px-4">
      {/* Cookbooks Header */}
      <div className="flex items-center mb-4 gap-5 text-white">
        <div className="flex gap-2 items-center">
          <ImBooks className="text-lg text-[#BE6F50]" />
          <span className="text-[16px] font-bold">Your Cookbooks</span>
        </div>
        {user !== null ? (
          <button onClick={toggleContent}>
            <FaPlus className="w-5 h-5" />
          </button>
        ) : null}
      </div>
      {user !== null ? (
        showContent ? (
          <>
            {/* Scrollable Container for Cookbooks */}
            <div className="overflow-y-scroll max-h-[70%] scrollbar-none flex flex-col gap-3 ">
              <Link to="/cook_books/1/favorites" className="sidebar-link">
                favorites
              </Link>
              {renderCookbooks()}
            </div>
          </>
        ) : (
          <form className="flex flex-col gap-2" onSubmit={makeNewCookbook}>
            <label htmlFor="cookbookName" className="text-white text-sm">
              Enter Cookbook Name:
            </label>
            <input
              type="text"
              id="cookbookName"
              name="cookbookName"
              className="px-2 py-1 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring focus:border-blue-300"
              maxLength={30}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#BE6F50] text-white px-2 py-1 rounded-lg text-sm"
              >
                Create Cookbook
              </button>
              <button
                type="button"
                onClick={toggleContent}
                className=" bg-[#272727] text-white px-2 py-1 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
            <div className=" text-red-600 text-sm">{error && errorMessage}</div>
          </form>
        )
      ) : (
        <h1 className="text-white text-sm">
          Please login to view your cookbooks
        </h1>
      )}
    </div>
  );
}
