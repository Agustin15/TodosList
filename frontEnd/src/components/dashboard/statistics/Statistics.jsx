import styles from "./Statistics.module.css";
import { BarChart } from "./barChart/BarChart";
import { DoughnutChart } from "./doughnutChart/DoughnutChart";

const Statistics = () => {
  return (
    <div className={styles.containStatistics}>
      <BarChart></BarChart>
      <DoughnutChart></DoughnutChart>
    </div>
  );
};

export default Statistics;
