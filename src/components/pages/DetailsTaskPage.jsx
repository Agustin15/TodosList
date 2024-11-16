import { useParams } from "react-router-dom";
import DetailsTask from "../detailsTask/DetailsTask";
import { TaskProvider } from "../../context/TaskContext";

const DetailsTaskPage = () => {
  const params = useParams();

  return (
   <TaskProvider>
      <DetailsTask params={params}></DetailsTask>
      </TaskProvider>
  );
};

export default DetailsTaskPage;
