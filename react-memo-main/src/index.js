import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import LivesProviders from "./providers/LivesProviders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LivesProviders value={1}>
      <RouterProvider router={router}></RouterProvider>
    </LivesProviders>
  </React.StrictMode>,
);
