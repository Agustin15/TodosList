import { createContext, useContext, useEffect, useState } from "react";

const WindowSizeContext = createContext();

export const WindowSizeProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    verifiyResize();
  }, []);

  const verifiyResize = () => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });
  };

  return (
    <WindowSizeContext.Provider value={{ windowWidth }}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSize = () => useContext(WindowSizeContext);
