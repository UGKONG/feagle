export type FilterList = Array<{ id: number; name: string }>;
export type Active = { sort: number; dir: "ASC" | "DESC"; filter: string };
export type HeaderList = Array<string>;
export type Props = { title: string; getList: () => void; close: () => void };
export type Device = {
  ID: number;
  MDL_SQ: "" | number;
  DEVICE_SN: string;
  DEVICE_BUY_DT: string;
  DEVICE_INSTL_DT: string;
};
export type Value = {
  SHOP_NM: string;
  SHOP_NUM: string;
  SHOP_ADD: string;
  SHOP_ADD_DTL: string;
  MNG_NM: string;
  MNG_NUM: string;
  MNG_GD: 1 | 2;
  MNG_ID: string;
  MNG_PW1: string;
  MNG_PW2: string;
};
