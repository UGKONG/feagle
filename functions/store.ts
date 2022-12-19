import { createStore } from "redux";
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
  // master: {
  //   MST_SQ: 1,
  //   MST_NM: "전상욱",
  //   MST_NUM: "010-0000-0000",
  //   MST_GRP: "리안소프트",
  //   MST_PO: "프로젝트 담당자",
  //   MST_GD: 1,
  //   MST_ID: "test",
  //   AUTH_SQ: 1,
  //   AUTH_TEXT: "전체 관리자",
  // },
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
const store = createStore(reducer);

// Store Export
export default store;
