import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import app from "../firebase.config.js";
import { UserProvider } from "./contex/userContex.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const client = "321973348565-t6eh5frql84m4anaq9b3i82afbdguhfg.apps.googleusercontent.com";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={client}>
      <UserProvider>
          <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
