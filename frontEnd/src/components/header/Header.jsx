import classesStyle from "./Header.module.css";
import logo from "../../assets/img/logo.png";
import menuOpen from "../../assets/img/menuOpen.png";
import accountIcon from "../../assets/img/profile.png";
import logOutIcon from "../../assets/img/logOut.png";
import { useEffect } from "react";
import { useDataUser } from "../../context/UserDataContext";
import { useMenu } from "../../context/MenuContext";
import { OptionsMenu } from "./optionsMenu/OptionsMenu";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
import { useCookies } from "react-cookie";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const Header = () => {
  const { user, getUserData, loadingUser, logoutSession } = useDataUser();
  const [cookies] = useCookies();
  const { headerClass, handleHideMenu } = useMenu();

  useEffect(() => {
    if (!cookies.loggedIn) location.href = urlFront + "login";
    getUserData();
  }, []);

  return (
    <header className={headerClass}>
      <nav>
        <div className={classesStyle.initHeader}>
          <div className={classesStyle.closeMenu}>
            <img onClick={handleHideMenu} src={menuOpen}></img>
          </div>
          <div className={classesStyle.logo}>
            <img src={logo}></img>

            <span>TodoList</span>
          </div>
          <SubscriptionProvider>
            <OptionsMenu />
          </SubscriptionProvider>
        </div>

        <div className={classesStyle.menuFoot}>
          <div
            onClick={() => (location.href = urlFront + "profile")}
            className={classesStyle.containProfile}
          >
            <div className={classesStyle.iconProfile}>
              <img src={accountIcon}></img>
            </div>
            <span>{loadingUser ? "Loading..." : user.name}</span>
          </div>

          <div onClick={logoutSession} className={classesStyle.logOut}>
            <img src={logOutIcon}></img>
            <span>Logout</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
