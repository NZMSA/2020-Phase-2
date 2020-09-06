import React from "react";
import { CircularProgress as Progress } from "@material-ui/core";

const CircularProgress = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
    <Progress disableShrink />
  </div>
);

export default CircularProgress;
