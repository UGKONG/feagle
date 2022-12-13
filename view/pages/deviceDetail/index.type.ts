import { Device, SetState } from "../../../types";

export interface DefaultInfoBoxProps {
  data: null | Device;
}
export interface StateInfoBoxProps {
  setIsDataChartModal: SetState<boolean>;
  setIsUseChartModal: SetState<boolean>;
  data: null | Device;
}
export interface ShopInfoBoxProps {
  data: null | Device;
}
