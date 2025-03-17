import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const urlBack = import.meta.env.VITE_LOCALHOST_BACK;

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case "setTasks":
      return action.payload;

    case "addTask":
      setTimeout(() => {
        location.reload();
      }, 2000);
      return [...state, action.payload];

    case "updateTask":
      return state.map((task) =>
        task._id == action.payload._id ? action.payload : task
      );

    case "deleteTask":
      return state.filter((task) => task._id !== action.payload);

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [loadingState, setLoadingState] = useState(true);
  const [completeTasks, setCompleteTasks] = useState();
  const [inCompleteTasks, setIncompleteTasks] = useState();
  const [openAlertToken, setOpenAlertToken] = useState(false);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    getTasksByUser();
  }, []);

  useEffect(() => {
    statisticsTasks();
  }, [tasks]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    location.href = `${urlFront}login`;
  };

  const getTasksByUser = async () => {
    setLoadingState(true);
    const optionGetTasks = {
      option: "getTasksByEmail",
      email: email
    };

    try {
      const response = await fetch(
        `${urlBack}todos/` + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`
          }
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw result.messageError;
      } else if (result.length > 0) {
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);

      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
    } finally {
      setLoadingState(false);
    }
  };

  const addTask = async (values) => {
    let data;
    setLoadingState(true);
    values.email = email;
    try {
      const response = await fetch(`${urlBack}todos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        },

        body: JSON.stringify(values)
      });
      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      }

      if (result) {
        data = result;
        dispatch({ type: "addTask", payload: result });
      }
    } catch (error) {
      console.log(error);

      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const updateTask = async (task) => {
    setLoadingState(true);

    let data;
    try {
      const response = await fetch(`${urlBack}todos/` + task._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        },
        body: JSON.stringify({ ...task })
      });
      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      }

      if (result) {
        data = result;
        dispatch({ type: "updateTask", payload: result });
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const deleteTask = async (id) => {
    let data;
    try {
      const response = await fetch(`${urlBack}todos/` + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      }
      if (result) {
        data = result;
        dispatch({ type: "deleteTask", payload: id });
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
    } finally {
      return data;
    }
  };

  const getTaskById = async (params) => {
    let data = null;
    setLoadingState(true);
    const optionGetTasks = {
      option: "getTaskById",
      id: params.id
    };
    try {
      const response = await fetch(
        `${urlBack}todos/` + JSON.stringify(optionGetTasks),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`
          }
        }
      );
      const result = await response.json();
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const statisticsTasks = () => {
    if (tasks.length > 0) {
      let taskComplete = tasks.reduce((ac, task) => {
        task.isCompleted ? ac++ : ac;
        return ac;
      }, 0);

      let taskIncomplete = tasks.reduce((ac, task) => {
        !task.isCompleted ? ac++ : ac;
        return ac;
      }, 0);

      setCompleteTasks(taskComplete);
      setIncompleteTasks(taskIncomplete);
    }
  };

  const getTasksStateFilter = async (state) => {
    setLoadingState(true);
    const optionGetTasks = {
      option: "getStateTasksByEmail",
      isCompleted: state,
      email: email
    };

    try {
      const response = await fetch(
        `${urlBack}todos/` + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`
          }
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      } else if (result) {
        dispatch({ type: "setTasks", payload: result });
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        setOpenAlertToken(true);
      }
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
        getTaskById,
        deleteTask,
        getTasksStateFilter,
        getTasksByUser,
        completeTasks,
        inCompleteTasks,
        openAlertToken,
        setOpenAlertToken
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
