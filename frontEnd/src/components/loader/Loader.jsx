import { PulseLoader } from "react-spinners";


const override = {
  display: "block",
  margin: "0 auto",
  opacity: "40%",
};

const Loader = ({ isLoading,color, size }) => {

  return (
    <PulseLoader
      color={color}
      loading={isLoading}
      cssOverride={override}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
