import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

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
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    getTasksByUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.href = "http://localhost:5173/login";
  };

  const getTasksByUser = async () => {
    setLoadingState(true);
    const optionGetTasks = {
      option: "getTasksByUsername",
      username: username,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/todos/" + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
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
        logout();
      }
    } finally {
      setLoadingState(false);
    }
  };

  const addTask = async (values) => {
    let data;
    setLoadingState(true);
    values.user = username;
    try {
      const response = await fetch("http://localhost:3000/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },

        body: JSON.stringify(values),
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
        logout();
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
      const response = await fetch("http://localhost:3000/todos/" + task._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },
        body: JSON.stringify({ ...task }),
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
        logout();
      }
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const deleteTask = async (id) => {
    let data;
    try {
      const response = await fetch("http://localhost:3000/todos/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`,
        },
        credentials: "include",
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
        logout();
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
      id: params.id,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/todos/" + JSON.stringify(optionGetTasks),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
        }
      );
      const result = await response.json();
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
      if (error.indexOf("Authentication") > -1) {
        logout();
      }
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const getTasksStateFilter = async (state) => {
    setLoadingState(true);
    const optionGetTasks = {
      option: "getStateTasksByUsername",
      isCompleted: state,
      username: username,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/todos/" + JSON.stringify(optionGetTasks),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`,
          },
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
        logout();
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
