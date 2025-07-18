import iconBarChart from "../../../../assets/img/chartBar.png";
import iconNoData from "../../../../assets/img/notDataChart.png";
import iconLoadPie from "../../../../assets/img/iconLoadPie.gif";
import CanvasJSReact from "@canvasjs/react-charts";
import { useTasks } from "../../../../context/TaskContext";
import styles from "../Statistics.module.css";
import { useState, useEffect } from "react";
import { useWindowSize } from "../../../../context/WindowSizeContext";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const BarChart = () => {
  const { loadingState, tasksIncompleteByWeekday, tasksCompleteByWeekday } =
    useTasks();
  const { windowWidth } = useWindowSize();
  const [datapointsCompleteByWeekday, setDatapointsCompleteByWeekday] =
    useState([]);
  const [datapointsIncompleteByWeekday, setDatapointsIncompleteByWeekday] =
    useState([]);

  let CanvasJSChart = CanvasJSReact.CanvasJSChart;

  useEffect(() => {
    let quantity = tasksIncompleteByWeekday.reduce((ac, task) => {
      return (ac += task.quantity);
    }, 0);

    if (quantity > 0) {
      setDatapointsIncompleteByWeekday(datapoints(tasksIncompleteByWeekday));
    }
  }, [tasksIncompleteByWeekday]);

  useEffect(() => {
    let quantity = tasksCompleteByWeekday.reduce((ac, task) => {
      return (ac += task.quantity);
    }, 0);
    if (quantity > 0) {
      setDatapointsCompleteByWeekday(datapoints(tasksCompleteByWeekday));
    }
  }, [tasksCompleteByWeekday]);

  const datapoints = (tasks) => {
    let dataPoints = tasks.map((tasks) => {
      return {
        label: tasks.weekday,
        y: tasks.quantity
      };
    });
    return dataPoints;
  };

  const optionsBar = {
    animationEnabled: true,
    exportEnabled: true,
    dataPointWidth: windowWidth <= 1024 ? 14 : 31,

    axisY: {
      title: "Tasks",
      includeZero: true
    },

    legend: {
      verticalAlign: "center",
      horizontalAlign: "right",
      reversed: true,
      cursor: "pointer",
      fontSize: windowWidth <= 1024 ? 10 : 12,
      horizontalAlign: windowWidth <= 1024 ? "left" : "right",
      verticalAlign: windowWidth <= 1024 ? "bottom" : "center"
    },
    data: [
      {
        type: "stackedColumn",
        name: "Completed",
        color: "#39e76b",
        showInLegend: true,
        dataPoints: datapointsCompleteByWeekday,
        click: function (event) {
          location.href = `${urlFront}tasks?tasksWeekDay=${JSON.stringify({
            state: 1,
            weekday: event.dataPoint.label
          })}`;
        }
      },
      {
        type: "stackedColumn",
        name: "Incomplete",
        color: "#d10909",
        showInLegend: true,
        dataPoints: datapointsIncompleteByWeekday,
        click: function (event) {
          location.href = `${urlFront}tasks?tasksWeekDay=${JSON.stringify({
            state: 0,
            weekday: event.dataPoint.label
          })}`;
        }
      }
    ]
  };

  return (
    <div className={styles.containBarChart}>
      <div className={styles.header}>
        <h3>Chart state tasks this week</h3>
        <img src={iconBarChart}></img>
      </div>
      {loadingState ? (
        <div className={styles.containLoading}>
          <img src={iconLoadPie}></img>
          <span>loading chart ...</span>
        </div>
      ) : datapointsCompleteByWeekday.length > 0 ||
        datapointsIncompleteByWeekday.length > 0 ? (
        <CanvasJSChart options={optionsBar}></CanvasJSChart>
      ) : (
        <div className={styles.noData}>
          <img src={iconNoData}></img>
          <span>Not tasks this week</span>
        </div>
      )}
    </div>
  );
};
