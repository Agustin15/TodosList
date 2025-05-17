import { ContainRingChart } from "./ContainRingChart";
import { useTasks } from "../../../../context/TaskContext";
import styles from "../Statistics.module.css";
import { useState, useEffect, useRef } from "react";

export const DoughnutChart = () => {
  const { tasksThisWeek } = useTasks();
  const [tasksCompleted, setTasksCompleted] = useState();
  const [tasksIncompleted, setTasksIncompleted] = useState();

  useEffect(() => {
    statisticsDoughnutChart();
  }, [tasksThisWeek]);

  const statisticsDoughnutChart = () => {
    let percentajeCompleted = 0,
      percentajeIncompleted = 0;

    let tasksCompleted = tasksThisWeek.reduce((ac, task) => {
      if (task.isCompleted) {
        ac++;
      }
      return ac;
    }, 0);

    let tasksIncompleted = tasksThisWeek.reduce((ac, task) => {
      if (!task.isCompleted) {
        ac++;
      }
      return ac;
    }, 0);

    if (tasksThisWeek.length > 0) {
      percentajeCompleted = (tasksCompleted * 100) / tasksThisWeek.length;
      percentajeIncompleted = (tasksIncompleted * 100) / tasksThisWeek.length;
    }
    setTasksCompleted(percentajeCompleted);
    setTasksIncompleted(percentajeIncompleted);
  };

  return (
    <div className={styles.rowRings}>
      <ContainRingChart
        option={"completed"}
        tasksCompleted={tasksCompleted}
        tasksIncompleted={tasksIncompleted}
        title={"Completed tasks this week"}
      ></ContainRingChart>

      <ContainRingChart
        option={"incomplete"}
        tasksCompleted={tasksCompleted}
        tasksIncompleted={tasksIncompleted}
        title={"Incomplete tasks this week"}
      ></ContainRingChart>
    </div>
  );
};
