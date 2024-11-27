import { useState } from "react";
import styles from "./TodoItem.module.css";
import { Link } from "react-router-dom";
import EditTodoForm from "../editTodoForm/EditTodoForm";
import iconDelete from "../../assets/img/deleteIcon.png";
import Modal from "../modal/Modal";
import DeleteTask from "../deleteTask/DeleteTaks";

const TodoItem = ({ task }) => {
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  return (
    <>
      <li key={task.id} className={styles.task}>
        <div className={styles.optionDelete}>
          <img
            title="Delete"
            onClick={() => {
              window.scrollTo(0, 0), setOpenModalDelete(true);
            }}
            src={iconDelete}
          ></img>
        </div>
        <div className={styles.info}>
          <div className={styles.icon}>
            <span>{task.icon}</span>
          </div>

          <div className={styles.dataTask}>
            <span>{task.name}</span>
            <span>
              <a>Creator: </a>
              {task.creator}
            </span>
            <div>
              <p>{task.description}</p>
            </div>
            <span
              className={
                task.isCompleted
                  ? styles.stateCompletedTask
                  : styles.statePendingTask
              }
            >
              <a>State: </a>
              {task.isCompleted ? "Complete" : "Pending"}
            </span>
          </div>
        </div>

        <div className={styles.options}>
          <a
            onClick={() => {
              window.scrollTo(0, 0), setOpenModalUpdate(true);
            }}
          >
            Edit
          </a>
          <Link className={styles.details} to={`${task.id}`}>
            Details
          </Link>
        </div>
      </li>

      {openModalUpdate && (
        <Modal>
          <EditTodoForm task={task} setOpenModalUpdate={setOpenModalUpdate} />
        </Modal>
      )}

      {openModalDelete && (
        <Modal>
          <DeleteTask task={task} setOpenModalDelete={setOpenModalDelete} />
        </Modal>
      )}
    </>
  );
};

export default TodoItem;
