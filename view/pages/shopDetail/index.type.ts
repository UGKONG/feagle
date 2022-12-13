import React from "react";
import { Manager, SetState, ShopDetail } from "../../../types";
import { Device } from "../shop/index.type";

export interface ManagerInfoBoxProps {
  getShopData: () => void;
  data: Manager | null;
}
export interface ShopInfoBoxProps {
  setIsDelModal: SetState<boolean>;
  getShopData: () => void;
  data: ShopDetail | null;
}
export interface ShopDelModalProps {
  delInputRef: React.RefObject<HTMLInputElement>;
}
export interface CreateDeviceModalProps {
  deviceList: Device[];
  setDeviceList: SetState<Device[]>;
}
