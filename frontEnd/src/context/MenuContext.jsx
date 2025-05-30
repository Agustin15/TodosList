import { createContext, useContext, useEffect, useState } from "react";
import classesStyle from "../components/header/Header.module.css";
const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [headerClass, setHeaderClass] = useState(classesStyle.header);

  const handleDisplayMenu = () => {
    setHeaderClass(classesStyle.header + " " + classesStyle.headerShow);
  };
  const handleHideMenu = () => {
    setHeaderClass(classesStyle.header + " " + classesStyle.headerHide);
  };

  return (
    <MenuContext.Provider
      value={{ handleDisplayMenu, handleHideMenu, headerClass }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
