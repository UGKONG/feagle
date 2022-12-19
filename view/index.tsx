import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as HistoryRouter, HashRouter } from "react-router-dom";
import store from "../functions/store";
import App from "./App";
import "./index.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import config from "../config";

const rootNode = document.querySelector("#root");

if (rootNode) {
  createRoot(rootNode).render(
    <React.StrictMode>
      <Provider store={store}>
        {config?.mode === "dev" ? (
          <HashRouter>
            <App />
          </HashRouter>
        ) : (
          <HistoryRouter>
            <App />
          </HistoryRouter>
        )}
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("RootNode is null!!");
}
