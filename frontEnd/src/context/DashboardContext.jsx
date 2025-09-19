import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { useTasks } from "./TaskContext";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { loadingState, tasksIncompleteByWeekday, tasksCompleteByWeekday } =
    useTasks();
  const { tasksThisWeek, loadingChartColumn } = useTasks();

  //useState for barChart
  const [datapointsCompleteByWeekday, setDatapointsCompleteByWeekday] =
    useState([]);
  const [datapointsIncompleteByWeekday, setDatapointsIncompleteByWeekday] =
    useState([]);

  //useState for lineChart
  const [loadingLineChart, setLoadingLineChart] = useState(true);
  const [dataPointsChartLine, setDataPointsChartLine] = useState();
  const [averageTasksByMonth, setAverageTasksByMonth] = useState();

  //useState for doughnutChart
  const [tasksCompleted, setTasksCompleted] = useState();
  const [tasksIncompleted, setTasksIncompleted] = useState();

  const [quantity, setQuantity] = useState({
    completed: tasksCompleted,
    incompleted: tasksIncompleted
  });

  useEffect(() => {
    statisticsDoughnutChart();
  }, [tasksThisWeek]);

  useEffect(() => {
    let quantity = tasksIncompleteByWeekday.reduce((ac, task) => {
      return (ac += task.quantity);
    }, 0);

    if (quantity > 0) {
      setDatapointsIncompleteByWeekday(
        datapointsBarChart(tasksIncompleteByWeekday)
      );
    }
  }, [tasksIncompleteByWeekday]);

  useEffect(() => {
    let quantity = tasksCompleteByWeekday.reduce((ac, task) => {
      return (ac += task.quantity);
    }, 0);
    if (quantity > 0) {
      setDatapointsCompleteByWeekday(
        datapointsBarChart(tasksCompleteByWeekday)
      );
    }
  }, [tasksCompleteByWeekday]);

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

      setQuantity({ completed: tasksCompleted, incompleted: tasksIncompleted });
    }
    setTasksCompleted(percentajeCompleted);
    setTasksIncompleted(percentajeIncompleted);
  };

  const datapointsBarChart = (tasks) => {
    let dataPoints = tasks.map((tasks) => {
      return {
        label: tasks.weekday,
        y: tasks.quantity
      };
    });
    return dataPoints;
  };

  const getDataPointsLineChart = async (year) => {
    setLoadingLineChart(true);
    try {
      const option = JSON.stringify({
        option: "getDataForChartTasksMonthly",
        year: year
      });

      const response = await fetch("/api/todos/" + option, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw result.messageError;
      }

      if (result) {
        setDataPointsChartLine(
          result.tasksByMonth.map((dataPoint) => {
            return {
              x: new Date(dataPoint.year, dataPoint.month),
              y: dataPoint.quantityTasks
            };
          })
        );

        setAverageTasksByMonth(result.average);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingLineChart(false);
    }
  };

  const getYearsOfTasks = async () => {
    setLoadingLineChart(true);
    const optionGetTasks = {
      option: "getYearsTasks"
    };
    try {
      const response = await fetch(
        `/api/todos/` + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw result.messageError;
      }

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingLineChart(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        quantity,
        tasksCompleted,
        tasksIncompleted,
        dataPointsChartLine,
        getDataPointsLineChart,
        averageTasksByMonth,
        getYearsOfTasks,
        loadingLineChart,
        loadingState,
        loadingChartColumn,
        datapointsCompleteByWeekday,
        datapointsIncompleteByWeekday
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
