import { createStore } from "redux";

// Store Dispatch Interface
interface Dispatch {
  type: keyof Store;
  payload: any;
}

// Store State Interface
export interface Store {
  number: number;
}

// Store Current State
const currentState: Store = {
  number: 1,
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
