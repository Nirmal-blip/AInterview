import React from "react";

const ErrorPage = ({ message }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage;
