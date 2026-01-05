import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// ✅ Provider component
export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState("");

  const login = (userName) => {
    setUser(userName);
  };

  const logout = () => {
    setUser("");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const UserAuth = () => {
  return useContext(AuthContext);
};
