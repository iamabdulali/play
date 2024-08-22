import React from "react";
import { ThreeDots } from "react-loader-spinner";

const LoadingWrapper = () => {
  return (
    <div className="fixed flex justify-center items-center top-0 bottom-0 w-full bg-[#121212] min-h-screen">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#fff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default LoadingWrapper;
