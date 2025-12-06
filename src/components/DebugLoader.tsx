import React from "react";
import Loader from "./Loader"; // Assuming Loader.tsx is in the same directory

const DebugLoader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Loader />
    </div>
  );
};

export default DebugLoader;
