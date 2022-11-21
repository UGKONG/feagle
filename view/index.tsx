import _React from "react";
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

const rootNode = document.querySelector("#root");

if (rootNode) {
  createRoot(rootNode).render(
    <Provider store={store}>
      <HistoryRouter>
        <App />
      </HistoryRouter>
    </Provider>
  );
} else {
  console.error("RootNode is null!!");
}
