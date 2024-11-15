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
    let data = null;
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
        data = result;
      }
      data = result;
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  const getIfExistTask = async (description, creator) => {
    let data = null;
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
      return data;
    }
  };

  const updateTask = async (task) => {

    let data = null;
    try {
      const response = await fetch(
        "http://localhost:3000/todos/"+ task.id,
        {
          method: "PUT",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...task }),
        }
      );
      const result = await response.json();
        
      if (result) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loadingState, addTask,updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
