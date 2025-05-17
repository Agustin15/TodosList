import iconChart from "../../../../assets/img/chartIcon.png";
import iconNoData from "../../../../assets/img/notDataRingChart.png";
import iconLoadPie from "../../../../assets/img/iconLoadPie.gif";
import CanvasJSReact from "@canvasjs/react-charts";
import styles from "../Statistics.module.css";
import { useTasks } from "../../../../context/TaskContext";
import { useRef } from "react";

export const ContainRingChart = ({
  option,
  tasksCompleted,
  tasksIncompleted,
  title
}) => {
 
  const { tasksThisWeek, loadingState } = useTasks();
  const chart = useRef();

  const optionsDoughnut = {
    animationEnabled: true,
    theme: "white",
    height: 123,

    data: [
      {
        type: "doughnut",
        innerRadius: "84%",
        startAngle: 90,
        yValueFormatString: "0",
        showInLegend: true,
        dataPoints: [
          {
            name:
              option == "completed" ? "Tasks Completed" : "Tasks Incomplete",
            y: option == "completed" ? tasksCompleted : tasksIncompleted,

            color: option == "completed" ? "#39e76b" : "#d10909"
          },
          {
            name: "Tasks restants",
            y: option == "completed" ? tasksIncompleted : tasksCompleted,
            color: "#ededed",
            showInLegend: false
          }
        ],
        backgroundColor: "gray"
      }
    ]
  };
  let CanvasJSChart = CanvasJSReact.CanvasJSChart;
  return (
    <div className={styles.containDoughnutChart}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <img src={iconChart}></img>
      </div>
      {loadingState ? (
        <div className={styles.containLoading}>
          <img src={iconLoadPie}></img>
          <span>loading chart ...</span>
        </div>
      ) :tasksThisWeek.length > 0 ? (
        <>
          <div className={styles.containPercentaje}>
            <h3>
              {Math.ceil(
                option == "completed" ? tasksCompleted : tasksIncompleted
              )}
              %
            </h3>
          </div>
          <CanvasJSChart ref={chart} options={optionsDoughnut}></CanvasJSChart>
        </>
      ) : (
        <div className={styles.noData}>
          <img src={iconNoData}></img>
          <span>Not tasks this week</span>
        </div>
      )}
    </div>
  );
};
