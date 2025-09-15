import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case "setTasks":
      return action.payload;

    case "updateTask":
      return state.map((task) =>
        task.idTask == action.payload.idTask ? action.payload : task
      );

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [tasksThisWeek, setTasksThisWeek] = useState([]);
  const [tasksIncompleteByWeekday, setTasksIncompleteByWeekday] = useState([]);
  const [tasksCompleteByWeekday, setTasksCompleteByWeekday] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (location.href == urlFront + "dashboard") {
      getTasksThisWeekUser();
      getTasksByWeekday();
    }
  }, []);

  const logout = () => {
    location.href = `${urlFront}login`;
  };

  const getTasksThisWeekUser = async () => {
    setLoadingState(true);

    const optionGetTasks = {
      option: "getTasksThisWeekUser"
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

      if (response.status == 401) {
        logout();
      }
      if (result) {
        setTasksThisWeek(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const getTasksByWeekday = async () => {
    setLoadingState(true);

    const optionGetTasks = {
      option: "getTasksByWeekday"
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
      if (response.status == 401) {
        logout();
      }
      if (result.tasksIncompleteByWeekday.length > 0) {
        setTasksIncompleteByWeekday(result.tasksIncompleteByWeekday);
      }
      if (result.tasksCompleteByWeekday.length > 0) {
        setTasksCompleteByWeekday(result.tasksCompleteByWeekday);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const addTask = async (values) => {
    let data;
    setLoadingState(true);

    const formData = new FormData();
    formData.append("icon", values.icon);
    formData.append("descriptionTask", values.descriptionTask);
    values.filesUploaded.forEach((file, index) => {
      formData.append("filesUpload" + index, file);
    });
    formData.append("datetimeTask", values.datetimeTask);
    formData.append("datetimeNotification", values.datetimeNotification);
    formData.append("state", values.isCompleted);

    try {
      const response = await fetch("/api/todos/", {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const formatDate = (date) => {
    let dateToFormat = new Date(date);
    let year = dateToFormat.getFullYear();
    let month = dateToFormat.getMonth() + 1;
    let day = dateToFormat.getDate();
    let hour = dateToFormat.getHours();
    let minutes = dateToFormat.getMinutes();

    let dateString =
      year +
      "-" +
      (month < 10 ? `0${month}` : month) +
      "-" +
      (day < 10 ? `0${day}` : day) +
      " " +
      (hour < 10 ? `0${hour}` : hour) +
      ":" +
      (minutes < 10 ? `0${minutes}` : minutes);

    return dateString;
  };

  const updateTask = async (task) => {
    let data;
    const formData = new FormData();
    formData.append("icon", task.icon);
    formData.append("descriptionTask", task.descriptionTask);
    task.filesUploaded.forEach((file, index) => {
      formData.append("filesUpload" + index, file);
    });

    formData.append("datetimeTask", formatDate(task.datetimeTask));
    formData.append("datetimeNotification", task.datetimeNotification);
    formData.append("state", task.isCompleted ? 1 : 0);

    setLoadingState(true);
    try {
      const response = await fetch("/api/todos/" + task.idTask, {
        method: "PUT",
        credentials: "include",
        body: formData
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }

      if (result) {
        data = result;
        dispatch({ type: "updateTask", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const patchStateTask = async (newState, idTask) => {
    setLoadingState(true);

    let data;
    try {
      const response = await fetch("/api/todos/" + idTask, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ newState: newState ? 1 : 0 })
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }

      if (result) {
        data = result;
        dispatch({ type: "updateTask", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const deleteTask = async (id) => {
    let data;

    try {
      const response = await fetch("/api/todos/" + id, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  const getTaskById = async (params) => {
    let data;

    setLoadingState(true);
    const optionGetTasks = {
      option: "getTaskById",
      id: parseInt(params.id)
    };

    try {
      const response = await fetch(
        "/api/todos/" + JSON.stringify(optionGetTasks),
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }

      if (result) {
        data = result;
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const getTasksByWeekdayFromChart = async (state, day) => {
    setLoadingState(true);

    const optionGetTasks = {
      option: "getTasksByWeekdayFromChart",
      state: state,
      day: day
    };

    try {
      const response = await fetch(
        "/api/todos/" + JSON.stringify(optionGetTasks),
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const result = await response.json();
      if (!response.ok) {
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }
      if (result) {
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        dispatch,
        loadingState,
        addTask,
        updateTask,
        patchStateTask,
        getTaskById,
        deleteTask,
        tasksThisWeek,
        getTasksByWeekdayFromChart,
        getTasksThisWeekUser,
        tasksCompleteByWeekday,
        tasksIncompleteByWeekday,
        formatDate
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
