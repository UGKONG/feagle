import { Device, SetState } from "../../../types";

export type DefaultInfoBoxProps = {
  data: null | Device;
};
export type StateInfoBoxProps = {
  setIsDataChartModal: SetState<boolean>;
  setIsUseChartModal: SetState<boolean>;
  data: null | Device;
};
export type ShopInfoBoxProps = {
  data: null | Device;
};
export type ChartDate = {
  start: string;
  end: string;
  type?: number;
};
export type UseChartData = {
  COMM_CODE: number;
  COMM_NM: string;
  VALUE: number;
};
export type DataChartData = {
  MONTH_SQ: number;
  MONTH_NM: string;
  VALUE: number;
};
