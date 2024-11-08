import { NavLink } from "react-router-dom";
import classesStyle from "./Header.module.css";

const Header = () => {
  return (
    <header className={classesStyle.header}>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
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
