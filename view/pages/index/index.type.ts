import { SetState } from "../../../types";

export type BoxProps = {
  type: "address" | "shop";
  id: number;
  name: string;
  setDeps: SetState<string[]>;
};
export type AddressData = {
  ADDR_NM: string;
  SHOP_COUNT: number;
  DEVICE_COUNT: number;
  USE_TIME: number;
  USE_COUNT: number;
};
export type ShopData = {
  SHOP_SQ: number;
  SHOP_NM: string;
  DEVICE_COUNT: number;
  USE_TIME: number;
  USE_COUNT: number;
};
