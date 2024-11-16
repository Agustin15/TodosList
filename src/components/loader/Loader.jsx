import { PulseLoader } from "react-spinners";
import { useTasks } from "../../context/TaskContext";

const override = {
  display: "block",
  margin: "0 auto",
  opacity: "40%",
};

const Loader = ({ color, size }) => {
  const { loadingState } = useTasks();

  return (
    <PulseLoader
      color={color}
      loading={loadingState}
      cssOverride={override}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
