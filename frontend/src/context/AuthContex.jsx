import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// const googleProvider = new GoogleAuthProvider(); // Removed Firebase

// authProvider
export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // register a user
  const registerUser = async (email, password, captchaToken) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/users/register`, {
        email,
        password,
        captchaToken,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // login the user
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/users/login`, {
        email,
        password,
      });
      // Backend returns user data in response.data.user
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      // Throw the error so it can be caught in Login.jsx
      throw error;
    }
  };

  // sign up with google
  const signInWithGoogle = async () => {
    // TODO: Implement Google login via backend if needed
    return null;
  };

  // logout the user
  const logout = async () => {
    try {
      await axios.post(`${getBaseUrl()}/api/users/logout`);
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // manage user and token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/users/me`);
        setCurrentUser(response.data.user);
      } catch (error) {
        // User not authenticated, that's fine
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
    setCurrentUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
