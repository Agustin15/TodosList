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

    case "addTask":
      return [...state, action.payload];

    case "updateTask":
      return state.map((task) =>
        task.idTask == action.payload.idTask ? action.payload : task
      );

    case "deleteTask":
      return state.filter((task) => task.idTask !== action.payload);

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [tasksThisWeek, setTasksThisWeek] = useState([]);
  const [tasksIncompleteByWeekday, setTasksIncompleteByWeekday] = useState([]);
  const [tasksCompleteByWeekday, setTasksCompleteByWeekday] = useState([]);
  const [quantityTasks, setQuantityTask] = useState();
  const [indexSelected, setIndexSelected] = useState(0);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    if (location.href.indexOf("dashboard") > -1) {
      getTasksThisWeekUser();
      getTasksByWeekday();
    }
  }, []);

  const searchTasks = async (
    optionFilter,
    optionQuantity,
    year,
    month,
    state,
    offset
  ) => {
    await getTasksFilter(optionFilter, year, month, state, offset);
    await getQuantityTasksFilter(optionQuantity, year, month, state);
  };

  const logout = () => {
    location.href = `${urlFront}login`;
  };

  const getTasksThisWeekUser = async (optionFilter) => {
    const optionGetTasks = {
      option: "getTasksThisWeekUser"
    };

    setLoadingState(true);
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
        if (optionFilter != "tasksThisWeekQuantity") setTasksThisWeek(result);
        else setQuantityTask(result.length);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };
  const getTasksThisWeekUserLimit = async (offset) => {
    const optionGetTasks = {
      option: "getTasksThisWeekUserLimit",
      offset: offset
    };

    setLoadingState(true);
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
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const getTasksByWeekday = async () => {
    const optionGetTasks = {
      option: "getTasksByWeekday"
    };

    setLoadingState(true);
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

  const getYearsOfTasks = async () => {
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
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  const getTasksFilter = async (optionFilter, year, month, state, offset) => {
    setLoadingState(true);

    const optionGetTasks = {
      option: optionFilter,
      year: year,
      month: month,
      state: state,
      offset: offset
    };

    try {
      const response = await fetch(
        "/api/todos/" + JSON.stringify(optionGetTasks),
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
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      } else if (result) {
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  const getQuantityTasksFilter = async (optionFilter, year, month, state) => {
    setLoadingState(true);
    const optionGetTasks = {
      option: optionFilter,
      year: year,
      month: month,
      state
    };

    try {
      const response = await fetch(
        "/api/todos/" + JSON.stringify(optionGetTasks),
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
        if (response.status == 401) {
          logout();
        }
        throw result.messageError;
      } else if (result) {
        setQuantityTask(result);
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
        dispatch({ type: "addTask", payload: result });
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

  const updateTask = async (task, filesUploadedUpdateForm) => {
    let data;
    const formData = new FormData();
    formData.append("icon", task.icon);
    formData.append("descriptionTask", task.descriptionTask);
    filesUploadedUpdateForm.forEach((file, index) => {
      formData.append("filesUpload" + index, file);
    });

    formData.append("datetimeTask", formatDate(task.datetimeTask));
    formData.append("state", task.isCompleted);

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

        body: JSON.stringify({ newState: newState })
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
        dispatch({ type: "deleteTask", payload: id });
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  const getTaskById = async (params) => {
    let data = null;
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
      return data;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        quantityTasks,
        indexSelected,
        setIndexSelected,
        dispatch,
        loadingState,
        addTask,
        updateTask,
        patchStateTask,
        getTaskById,
        deleteTask,
        tasksThisWeek,
        getTasksThisWeekUser,
        getTasksFilter,
        getTasksThisWeekUserLimit,
        searchTasks,
        getYearsOfTasks,
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
