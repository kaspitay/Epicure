import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import BASE_URL from "../config"; // Adjust the path as needed

//sending a post request to server to create a user
export const useSignup = () => {
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signup = async (name, email, password, userType, bio, profilePicture) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType,
          bio,
          profilePicture,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({ type: "LOGIN", payload: data });
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        setError(data.message || "An error occurred. Please try again.");
        return false;
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      return false;
    }
  };

  return {
    error,
    loading,
    signup,
  };
};
