import { createContext, useContext } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    location.href = "http://localhost:5173/login";
  };

  const verifyToTokenExpired = async () => {
    try {
      const response = await fetch("http://localhost:3000/token/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      } else if (result.message == true) {
        return "to expire";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchToRefreshToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/token/" + email, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.stringify(refreshToken)}`,
        },
      });
      const newToken = await response.json();
      if (!response.ok) {
        throw newToken.messageError;
      } else if (newToken) {
        localStorage.setItem("token", newToken);
        location.reload();
      }
    } catch (error) {
      logout();
      console.log(error);
    }
  };

  return (
    <TokenContext.Provider
      value={{
        logout,
        verifyToTokenExpired,
        fetchToRefreshToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
