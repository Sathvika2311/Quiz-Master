
import React, { createContext, useState, useContext } from "react";

// Create a User Context
export const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store user details

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export const CurrentUser = () => useContext(UserContext);