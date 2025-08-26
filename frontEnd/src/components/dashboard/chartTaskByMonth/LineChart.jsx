import styles from "./LineChart.module.css";
import iconLoadPie from "../../../assets/img/iconLoadPie.gif";
import iconLineChart from "../../../assets/img/chartLine.png";
import iconSearch from "../../../assets/img/search.png";
import CanvasJSReact from "@canvasjs/react-charts";
import { useEffect, useRef, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";
import { useWindowSize } from "../../../context/WindowSizeContext";

export const LineChart = () => {
  let CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const {
    getYearsOfTasks,
    getDataPointsLineChart,
    dataPointsChartLine,
    loadingLineChart,
    averageTasksByMonth
  } = useDashboard();

  const [years, setYears] = useState();
  const refSelect = useRef();

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    dataToChart();
  }, []);

  const dataToChart = async () => {
    const years = await getYearsOfTasks();

    if (years) {
      setYears(years);
      getDataPointsLineChart(new Date().getFullYear());
    }
  };

  const searchDataChartByYear = () => {
    getDataPointsLineChart(refSelect.current.value);
  };

  const options = {
    animationEnabled: true,
    height: windowWidth <= 1024 ? 262 : 355,

    axisX: {
      valueFormatString: "MMM"
    },
    axisY: {
      title: "Quantity tasks",
      gridThickness: 0,
      stripLines: [
        {
          value: averageTasksByMonth,
          label: "Average"
        }
      ]
    },
    data: [
      {
        yValueFormatString: "",
        xValueFormatString: "MMMM",
        type: "spline",
        dataPoints: dataPointsChartLine
      }
    ]
  };

  return (
    <div className={styles.containChart}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.containSelect}>
            <div className={styles.search}>
              <select ref={refSelect}>
                {years &&
                  years.map((year, index) => (
                    <option key={index}>{Object.values(year)}</option>
                  ))}
              </select>
              <button onClick={searchDataChartByYear}>
                <img src={iconSearch}></img>
              </button>
            </div>
          </div>
          <div className={styles.title}>
            <h3>
              Monthly Tasks {refSelect.current && refSelect.current.value}
            </h3>
            <img src={iconLineChart}></img>
          </div>
        </div>
        {loadingLineChart && (
          <div className={styles.containLoading}>
            <img src={iconLoadPie}></img>
            <span>loading chart ...</span>
          </div>
        )}

        {!loadingLineChart && dataPointsChartLine ? (
          <CanvasJSChart options={options} />
        ) : !loadingLineChart && !dataPointsChartLine ? (
          <div className={styles.noData}>
            <img src={iconLineChart}></img>
            <h3>Tasks not found in year selected</h3>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
