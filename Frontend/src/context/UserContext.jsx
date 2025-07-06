import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("User data:", result.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

    const getGeminiResponse = async (command) => {
    try {
    const result = await axios.post(`${serverUrl}/api/auth/user/asktoassistant`, { command }, { withCredentials: true });
    console.log("✅ Response from backend (Gemini):", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ Error from Gemini backend:", error.response?.data || error.message);
    return { text: "Error occurred while calling Gemini." };
  }
};



  useEffect(() => {
    handleCurrentUser();
  }, [])
  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage,
    getGeminiResponse
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContextProvider;
