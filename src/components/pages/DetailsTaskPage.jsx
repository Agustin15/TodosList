import { useParams } from "react-router-dom";
import DetailsTask from "../detailsTask/DetailsTask";

const DetailsTaskPage = () => {
  const params = useParams();

  return <DetailsTask params={params}></DetailsTask>;
};

export default DetailsTaskPage;
