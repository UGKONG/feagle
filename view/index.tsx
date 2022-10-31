import _React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "../functions/store";
import App from "./App";
import "./index.scss";

const rootNode = document.querySelector("#root");

if (rootNode) {
  createRoot(rootNode).render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
} else {
  console.error("RootNode is null!!");
}
