import { createContext, useContext } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;
const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const email = localStorage.getItem("email");
  const refreshToken = localStorage.getItem("refreshToken");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    location.href = `${urlFront}login`;
  };

  const fetchToRefreshToken = async () => {
    try {
      const response = await fetch(`${urlBack}token/` + email, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.stringify(refreshToken)}`
        }
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
        fetchToRefreshToken
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
