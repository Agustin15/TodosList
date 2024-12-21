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
  const username = JSON.parse(localStorage.getItem("username"));
  console.log("taskProvider:", tasks);
  useEffect(() => {
    const getTasksByUser = async () => {
      setLoadingState(true);
      try {
        const response = await fetch("http://localhost:3000/todos/" + username);
        const result = await response.json();
        if (!response.ok) {
          throw result.messageError;
        } else if (result.length > 0) {
          dispatch({ type: "setTasks", payload: result });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingState(false);
      }
    };

    getTasksByUser();
  }, []);

  const addTask = async (values) => {
    let data;
    setLoadingState(true);
    values.user = username;
    try {
      const response = await fetch("http://localhost:3000/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    } finally {
      return data;
    }
  };

  const getTaskById = async (params) => {
    let data = null;
    setLoadingState(true);
    try {
      const response = await fetch(
        "http://localhost:3000/todos?id=" + params.id
      );
      const result = await response.json();
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadingState,
        addTask,
        updateTask,
        getTaskById,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
