import Lottie from "react-lottie";

import NavBar from "../components/NavBar";
import animationData from "../../public/lottie-animation.json";

const Landing = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <NavBar />
      <div className="flex mt-24">
        <div className="w-1/2">
          <Lottie options={defaultOptions} />
        </div>
        <h1 className="w-1/2 mt-48 text-5xl font-extrabold text-center text-tremor-brand">
          Welcome to your IoT Dashboard
        </h1>
      </div>
    </>
  );
};

export default Landing;
