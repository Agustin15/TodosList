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
    case "changeStateTask":
      return state.map((task) =>
        task.id == action.payload.id ? action.payload : task
      );

    case "deleteTask":
      return state.filter((task) => task.id !== action.payload.id);

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      setLoadingState(true);
      let data = null;
      try {
        const response = await fetch("http://localhost:3000/todos");
        const result = await response.json();
        if (result.length > 0) {
          data = result;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingState(false);
        dispatch({ type: "setTasks", payload: data });
      }
    };

    getTasks();
  }, []);

  const addTask = async (values) => {
    let errorFetch = false;
    setLoadingState(true);
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result) {
        dispatch({ type: "addTask", payload: result });
      }
    } catch (error) {
      console.log(error);
      errorFetch = true;
      return errorFetch;
    } finally {
      setLoadingState(false);
    }
  };

  const getIfExistTask = async (description, creator) => {
    let data = null;
    setLoadingState(true);
    try {
      const response = await fetch(
        "http://localhost:3000/todos?creator=" +
          creator +
          "&&description" +
          description
      );
      const result = await response.json();
      if (result.length > 0) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
      return data;
    }
  };

  const updateTask = async (task) => {
    console.log(task);
    setLoadingState(true);
    try {
      const response = await fetch("http://localhost:3000/todos/" + task.id, {
        method: "PUT",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task }),
      });
      const result = await response.json();

      if (result) {
        dispatch({ type: "updateTask", payload: result });
      }
    } catch (error) {
      console.log(error);
      errorFetch = true;
      return errorFetch;
    } finally {
      setLoadingState(false);
    }
  };

  const changeStateTask = async (task) => {
    let errorFetch = false;
    try {
      const response = await fetch("http://localhost:3000/todos/" + task.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: task.isCompleted ? false : true }),
      });
      const result = await response.json();
      if (result) {
        dispatch({ type: "changeStateTask", payload: result });
        return result;
      }
    } catch (error) {
      console.log(error);
      errorFetch = true;
      return errorFetch;
    }
  };

  const deleteTask = async (task) => {
    console.log(task);
    let errorFetch = false;
    try {
      const response = await fetch("http://localhost:3000/todos/" + task.id, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log(result);
      if (result) {
        dispatch({ type: "deleteTask", payload: result });
      }
    } catch (error) {
      console.log(error);
      errorFetch = true;
      return errorFetch;
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
        getIfExistTask,
        updateTask,
        changeStateTask,
        getTaskById,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
