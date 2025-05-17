import { createContext, useContext, useState } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);

  const getUserData = async () => {
    setLoadingUser(true);
    try {
      const response = await fetch("/api/userData/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.status == 401) {
        location.href = urlFront + "/login";
      }
      if (result) {
        setUser(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const logoutSession = async () => {
    try {
      const response = await fetch("/api/logout/", {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();

      if (result.logout) {
        location.href = urlFront + "/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserDataContext.Provider
      value={{ getUserData, user, loadingUser, logoutSession }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useDataUser = () => useContext(UserDataContext);
