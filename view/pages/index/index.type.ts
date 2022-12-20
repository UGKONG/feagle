import { SetState } from "../../../types";

export type Type = "address" | "shop";
export type BoxProps = {
  id: number;
  name: string;
  data: Data;
  color: string;
  setDepth: SetState<string[]>;
};
export type Data = {
  TITLE: string;
  SHOP_SQ?: number;
  SHOP_COUNT?: number;
  DEVICE_COUNT: number;
  USE_TIME: number;
  USE_COUNT: number;
  ON_DEVICE_COUNT: number;
  START_DEVICE_COUNT: number;
  NEED_GAS_DEVICE_COUNT: number;
  NEED_PLA_DEVICE_COUNT: number;
};
export type Count = { shop: number; device: number };
