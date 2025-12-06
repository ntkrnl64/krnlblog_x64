import React from "react";
import { Spinner, tokens } from "@fluentui/react-components";

const Loader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: tokens.colorNeutralBackground1,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Spinner size="huge" labelPosition="below" label="加载中..." />
    </div>
  );
};

export default Loader;
