import { useEffect, useState } from "react";
import styles from "./DetailsTask.module.css";
import noFound from "../../assets/img/noFound.png";
import iconError from "../../assets/img/errorIcon2.png";
import ItemDetails from "./itemDetails/itemDetails";
import { useTasks } from "../../context/TaskContext";

import Loader from "../loader/Loader";
import Modal from "../modal/Modal";

const DetailsTask = ({ params }) => {
  const [task, setTask] = useState();
  const [modal, setModal] = useState(false);
  const { changeStateTask, getTaskById, loadingState } = useTasks();

  useEffect(() => {
    const getDataTask = async () => {
      const data = await getTaskById(params);

      setTask(...data);
    };

    getDataTask();
  }, []);

  const handleChangeState = async () => {
    let result = await changeStateTask(task);

    if (typeof result == "object") {
      setTask(result);
    } else {
      setModal(true);
    }
  };

  return (
    <div className={styles.containTask}>
      <div className={loadingState ? styles.loadingShow : styles.loadingHide}>
        <h3>loading task</h3>

        <Loader isLoading={loadingState} color="blue" size={7} />
      </div>

      {task && (
        <ItemDetails task={task} handleChangeState={handleChangeState} />
      )}
      <div
        className={!task && !loadingState ? styles.noFound : styles.noFoundHide}
      >
        <img src={noFound}></img>
        <h3>Ups,task not found</h3>
      </div>

      {modal && (
        <Modal>
          <div className={styles.alert}>
            <img src={iconError}></img>
            <span>Ups, Can't update task</span>

            <button onClick={() => setModal(false)}>OK</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DetailsTask;
