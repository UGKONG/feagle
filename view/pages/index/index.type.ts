import { SetState } from "../../../types";

export type Type = "address" | "shop";
export type BoxProps = {
  id: number;
  name: string;
  data: Data;
  color: string;
  isAddr: boolean;
  setDepth: SetState<string[]>;
  setActiveAddress: SetState<number>;
};
export type Data = {
  ADDR_SQ?: number;
  TITLE: string;
  SHOP_SQ?: number;
  SHOP_NM?: string;
  SHOP_COUNT?: number;
  DEVICE_COUNT: number;
  USE_TIME: number;
  USE_COUNT: number;
  ON_COUNT: number;
  START_COUNT: number;
  GAS_DANGER_COUNT: number;
  PLA_DANGER_COUNT: number;
};
export type Count = { shop: number; device: number };
