import { createStore } from "redux";
import { AlertData, Master, OrNull } from "../types";

// Store Dispatch Interface
interface Dispatch {
  type: keyof Store;
  payload: any;
}

// Store State Interface
export interface Store {
  master: OrNull<Master>;
  alert: OrNull<AlertData>;
}

// Store Current State
const currentState: Store = {
  master: null,
  alert: null,
};

// Store Reducer
const reducer = (state: Store = currentState, action: Dispatch): Store => {
  return {
    ...state,
    [action?.type]: action?.payload,
  };
};

// Create Store
const store = createStore(reducer);

// Store Export
export default store;
