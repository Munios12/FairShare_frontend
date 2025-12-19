import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

import AuthProvider from "./context/AuthContext";
import GroupsProvider from "./context/GroupsContext";
import ExpensesProvider from "./context/ExpensesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <GroupsProvider>
        <ExpensesProvider>
          <App />
        </ExpensesProvider>
      </GroupsProvider>
    </AuthProvider>
  </React.StrictMode>
);
