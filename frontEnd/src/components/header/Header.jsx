import classesStyle from "./Header.module.css";
import iconLogo from "../../assets/img/iconLogo.png";
import btnImgPlus from "../../assets/img/plus.png";
import accountIcon from "../../assets/img/account.png";
import Modal from "../modal/Modal";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import { TaskProvider } from "../../context/TaskContext";
import { FormProvider } from "../../context/FormContext";
import { useState } from "react";

const Header = () => {
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const username = JSON.parse(localStorage.getItem("username"));

  return (
    <>
      <header className={classesStyle.header}>
        <nav>
          <div className={classesStyle.initHeader}>
            <img src={iconLogo}></img>
            <span>TodoList</span>
            <ul>
              <li>
                <button onClick={() => setOpenModalAdd(true)}>
                  Add new Task
                  <img src={btnImgPlus}></img>
                </button>
              </li>
            </ul>
          </div>
          <div className={classesStyle.containProfile}>
            <span>{username}</span>
            <img src={accountIcon}></img>
          </div>
        </nav>
      </header>

      {openModalAdd && (
        <Modal>
          <TaskProvider>
            <FormProvider>
              <AddTodoForm setOpenModalAdd={setOpenModalAdd} />
            </FormProvider>
          </TaskProvider>
        </Modal>
      )}
    </>
  );
};

export default Header;
