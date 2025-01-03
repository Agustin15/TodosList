import iconChart from "../../assets/img/chartIcon.png";
import styles from "./Statistics.module.css";
import pendingIcon from "../../assets/img/pendingTask.png";
import completeIcon from "../../assets/img/completeTask.png";
import noDataIcon from "../../assets/img/noData.png";
import Chart from "../pieChart/Chart";
import { useTasks } from "../../context/TaskContext";

const Statistics = () => {
  const { completeTasks, inCompleteTasks, tasks } = useTasks();

  return (
    <div className={styles.containStatistics}>
      <div className={styles.header}>
        <h3>Tasks statistics </h3>
        <img src={iconChart}></img>
      </div>

      <div className={styles.body}>
        <div className={tasks.length > 0 ? styles.dataShow : styles.dataHide}>
          <ul>
            <li>
              <img src={pendingIcon}></img>
              Pending tasks:{inCompleteTasks}
            </li>
            <li>
              <img src={completeIcon}></img>
              Complete tasks:{completeTasks}
            </li>
          </ul>
          <Chart></Chart>
        </div>

        <div
          className={tasks.length > 0 ? styles.noDataHide : styles.noDataShow}
        >
          <img src={noDataIcon}></img>
          <span>No tasks</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
