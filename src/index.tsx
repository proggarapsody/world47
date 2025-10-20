import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./all.min.css";
import "./style.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
