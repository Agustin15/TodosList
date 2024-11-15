import { useEffect,useState } from "react";
import styles from "./DetailsTask.module.css";
import noFound from "../../assets/img/noFound.png";
import ItemDetails from "./itemDetails/itemDetails";

const DetailsTask = ({ params }) => {
  const [task, setTask] = useState();

  const getTaskById = async () => {
    let data = null;
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
      return data;
    }
  };

  useEffect(() => {
    const getDataTask = async () => {
      const data = await getTaskById();
      if (data || data.length > 0) {
        setTask(...data);
      }
    };
    getDataTask();
  }, [task]);

  const putTask = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos/" + task.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: task.isCompleted ? false : true }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeState = async () => {
    let resultPut = await putTask();
    if(!resultPut){
      alert("No se puedo actualizar el estado de la tarea");
    }
  
  };

  if (task) {
    return <ItemDetails task={task} handleChangeState={handleChangeState} />;
  } else {
    return (
      <div className={styles.noFound}>
        <img src={noFound}></img>
        <h3>Tarea no encontrada</h3>
      </div>
    );
  }
};

export default DetailsTask;
