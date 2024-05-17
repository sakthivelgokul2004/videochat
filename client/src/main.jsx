import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import app from "../firebase.config.js";
import { UserProvider } from "./contex/userContex.jsx";
import { SocketContexProvider } from "./contex/SocketContex.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
);
