import { ContainRingChart } from "./ContainRingChart";
import styles from "../Statistics.module.css";
import { useDashboard } from "../../../../context/DashboardContext";

export const DoughnutChart = () => {
  const { tasksCompleted, tasksIncompleted, quantity } = useDashboard();

  return (
    <div className={styles.rowRings}>
      <ContainRingChart
        option={"completed"}
        tasksCompleted={tasksCompleted}
        tasksIncompleted={tasksIncompleted}
        title={"Completed tasks this week"}
        quantity={quantity.completed}
      ></ContainRingChart>

      <ContainRingChart
        option={"incomplete"}
        tasksCompleted={tasksCompleted}
        tasksIncompleted={tasksIncompleted}
        title={"Incomplete tasks this week"}
        quantity={quantity.incompleted}
      ></ContainRingChart>
    </div>
  );
};
