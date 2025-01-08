import { createContext, useReducer, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import BASE_URL from "../config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
      };
    case "UPDATE_USER":
      return {
        user: action.payload,
      };
    default:
      return state;
  }
};
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    // const user = null;
  }, []);

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [state]);


  return (
    <AuthContext.Provider value={{ ...state, dispatch, users }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
