import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import BaseProvider from "./components/BaseProvider";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BaseProvider>
      <App />
    </BaseProvider>
  </React.StrictMode>
);
