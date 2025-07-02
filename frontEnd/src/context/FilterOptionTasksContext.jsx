import { useContext, useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { createContext } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const FilterOptionTasksContext = createContext();

export const FilterOptionTasksProvider = ({ children }) => {
  const refSelectYear = useRef();
  const refSelectMonth = useRef();
  const refSelectState = useRef();
  const refCheckBoxThisWeek = useRef();
  const refInputNumberIndex = useRef();
  const [openFilter, setOpenFilter] = useState(false);
  const [indexSelected, setIndexSelected] = useState(1);
  const [quantityTasks, setQuantityTask] = useState();
  const [loadingFilter, setLoadingFilter] = useState(false);

  const logout = () => {
    location.href = `${urlFront}login`;
  };

  useEffect(() => {
    if (refInputNumberIndex.current) {
      refInputNumberIndex.current.value = indexSelected;
    }
  }, [indexSelected]);

  const getTasksThisWeekByStateAndUser = async () => {
    const optionGetTasks = {
      option: "getTasksThisWeekByStateAndUser",
      state: refSelectState.current.value
    };

    setLoadingFilter(true);
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
        setQuantityTask(result.length);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFilter(false);
    }
  };

  const getTasksThisWeekByStateAndUserLimit = async (offset, dispatch) => {
    const optionGetTasks = {
      option: "getTasksThisWeekByStateAndUserLimit",
      offset: (offset - 1) * 10,
      state: refSelectState.current.value
    };

    setLoadingFilter(true);
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
      setLoadingFilter(false);
    }
  };
  const getTasksFilter = async (optionFilter, offset, dispatch) => {
    setLoadingFilter(true);

    const optionGetTasks = {
      option: optionFilter,
      year: refSelectYear.current.value,
      month: refSelectMonth.current.value,
      state: refSelectState.current.value,
      offset: (offset - 1) * 10
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
      setLoadingFilter(false);
    }
  };

  const getQuantityTasksFilter = async (optionFilter) => {
    setLoadingFilter(true);
    const optionGetTasks = {
      option: optionFilter,
      year: refSelectYear.current.value,
      month: refSelectMonth.current.value,
      state: refSelectState.current.value
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
      setLoadingFilter(false);
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
  return (
    <FilterOptionTasksContext.Provider
      value={{
        refSelectMonth,
        refSelectYear,
        refSelectState,
        indexSelected,
        setIndexSelected,
        refCheckBoxThisWeek,
        refInputNumberIndex,
        getTasksFilter,
        getQuantityTasksFilter,
        getTasksThisWeekByStateAndUser,
        getTasksThisWeekByStateAndUserLimit,
        getYearsOfTasks,
        loadingFilter,
        quantityTasks,
        setQuantityTask,
        openFilter,
        setOpenFilter
      }}
    >
      {children}
    </FilterOptionTasksContext.Provider>
  );
};

export const useFilterOptionTasks = () => useContext(FilterOptionTasksContext);
