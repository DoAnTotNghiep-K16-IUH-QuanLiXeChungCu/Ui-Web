import React, { createContext, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
