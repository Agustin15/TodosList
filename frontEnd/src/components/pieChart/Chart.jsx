import styles from "./Chart.module.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTasks } from "../../context/TaskContext";

const Chart = () => {
  const { completeTasks, inCompleteTasks, tasks } = useTasks();

  let totalTasks = tasks.length;
  let percentageComplete = (completeTasks * 100) / totalTasks;
  let percentageIncomplete = (inCompleteTasks * 100) / totalTasks;

  ChartJS.register(ArcElement, Legend, ChartDataLabels);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        color: "white",
        font: {
          size: 17,
        },
        formatter: function (value) {
          return value + "%";
        },
      },
      legend: {
        position: "bottom",
        labels: {
          padding: window.screen.width <= 478 ? 6 : 8,
          boxHeight: 13,
          font: {
            size: window.screen.width <= 478 ? 12 : 15,
          },
          useBorderRadius: true,
          borderRadius: 70,
        },
      },
    },
  };

  const data = {
    labels: ["Pending", "Complete"],
    datasets: [
      {
        data: [percentageIncomplete.toFixed(0), percentageComplete.toFixed(0)],
        backgroundColor: ["rgb(214, 12, 56)", "rgb(11, 179, 39)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className={styles.containChart}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default Chart;
