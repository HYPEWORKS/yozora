import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import BaseProvider from "./components/BaseProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BaseProvider>
      <App />
    </BaseProvider>
  </React.StrictMode>,
);
