import CanvasJSReact from "@canvasjs/react-charts";
import styles from "./Chart.module.css";
let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";
CanvasJS.addColorSet("customColor", ["#a50606", "#05ad0d"]);

const Chart = () => {
  const { completeTasks, inCompleteTasks, tasks } = useTasks();

  let totalTasks = tasks.length;
  let percentageComplete = (completeTasks * 100) / totalTasks;
  let percentageIncomplete = (inCompleteTasks * 100) / totalTasks;
  let widthChart, heightChart;
  let fontIndexLabel = 14,
    fontSize = 16;

  const setDimensionsChart = (width, height, fontIndex, fontSize) => {
    widthChart = width;
    heightChart = height;
    fontIndexLabel = fontIndex;
    fontSize = fontSize;
  };

  function explodePie(e) {
    if (
      typeof e.dataSeries.dataPoints[e.dataPointIndex].exploded ===
        "undefined" ||
      !e.dataSeries.dataPoints[e.dataPointIndex].exploded
    ) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
  }

  let dataTasks = [
    { y: percentageIncomplete, name: "Pending" },
    { y: percentageComplete, name: "Complete" },
  ];

  let dataMax = dataTasks.reduce((prevData, currentData) => {
    return prevData.y > currentData.y ? prevData : currentData;
  });

  dataMax.exploded = true;

  switch (true) {
    case screen.width >= 667 && screen.width <= 768:
      setDimensionsChart(324, 225, 13, 14);
      break;
    case screen.width >= 375 && screen.width <= 478:
      setDimensionsChart(236, 267, 13, 13);
      break;
  }

  const options = {
    exportEnabled: true,
    animationEnabled: true,
    colorSet: "customColor",
    width: widthChart,
    height: heightChart,
    legend: {
      cursor: "pointer",
      itemclick: explodePie,
      fontSize: fontSize,
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name}: <strong>{y}%</strong>",
        indexLabel: "{name} - {y}%",
        indexLabelFontSize: fontIndexLabel,
        dataPoints: dataTasks,
      },
    ],
  };

  return (
    <div className={styles.containChart}>
      <CanvasJSChart options={options} />
    </div>
  );
};

export default Chart;
