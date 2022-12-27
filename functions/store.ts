import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { AlertData, GasReq, Master, OrNull } from "../types";

// Store Dispatch Interface
interface Dispatch {
  type: keyof Store;
  payload: any;
}

// Store State Interface
export interface Store {
  master: OrNull<Master>;
  alert: OrNull<AlertData>;
  customTitle: string;
  noticeList: Array<GasReq>;
}

// Store Current State
const currentState: Store = {
  master: null,
  alert: null,
  customTitle: "",
  noticeList: [],
};

// Store Reducer
const reducer = (state: Store = currentState, action: Dispatch): Store => {
  return {
    ...state,
    [action?.type]: action?.payload,
  };
};

// Create Store
const store = createStore(reducer, composeWithDevTools());

// Store Export
export default store;
