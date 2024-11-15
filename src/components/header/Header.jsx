import { NavLink } from "react-router-dom";
import classesStyle from "./Header.module.css";
import iconLogo from "../../assets/img/iconLogo.png" 

const Header = () => {
  return (
    <header className={classesStyle.header}>
      <nav>
        <img src={iconLogo}></img>
        <ul>
          <li>
            <NavLink to="/tasks">Tasks</NavLink>
          </li>
          <li>
            <NavLink to="/addNewTask">Add new Task</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
