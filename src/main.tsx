import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// When deployed to a subpath (e.g. GitHub project Pages at /<repo>/), Vite's
// `base` is "/" + something. React Router must know that prefix as `basename`,
// otherwise programmatic navigation strips it and lands outside the app.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
