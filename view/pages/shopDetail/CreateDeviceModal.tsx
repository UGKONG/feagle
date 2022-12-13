import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import {
  DeviceAddBtn,
  DeviceDelBtn,
  DeviceInput,
  DeviceRow,
  InputContainer,
  Label,
  Left,
  Select,
} from "../shop/CreateShopModal";
import type {
  DeviceModel,
  InputChangeEvent,
  SelectChangeEvent,
} from "../../../types";
import type { Device } from "../shop/index.type";
import { FiMinus, FiPlus } from "react-icons/fi";
import { CreateDeviceModalProps } from "./index.type";

export default function CreateDeviceModal({
  deviceList,
  setDeviceList,
}: CreateDeviceModalProps) {
  const [modelList, setModelList] = useState<DeviceModel[]>([]);

  // 모델 리스트 조회
  const getModelList = (): void => {
    useAxios.get("/model").then(({ data }) => {
      if (!data?.result) return setModelList([]);
      setModelList(data?.current);
    });
  };

  // 모델 변경
  const changeDeviceValue = (id: number, key: string, val: any): void => {
    setDeviceList((prev) => {
      let otherList = prev?.filter((x) => x?.ID !== id);
      let target = prev?.find((x) => x?.ID === id) as Device;
      target = { ...target, [key]: val };
      let result = [...otherList, target];
      result?.sort((a, b) => a?.ID - b?.ID);
      return result;
    });
  };

  // 해당 장비 찾기
  const findValue = (id: number): Device => {
    return deviceList?.find((x) => x?.ID === id) as Device;
  };

  // 장비 삭제
  const remoteDevice = (id: number): void => {
    setDeviceList((prev) => prev?.filter((x) => x?.ID !== id));
  };

  // 장비 추가
  const addDevice = (): void => {
    setDeviceList((prev) => {
      if (prev?.length === 0) {
        return [
          {
            ID: 1,
            MDL_SQ: "",
            DEVICE_SN: "",
            DEVICE_BUY_DT: "",
            DEVICE_INSTL_DT: "",
          },
        ];
      }

      let maxId = prev[prev?.length - 1]?.ID;
      return [
        ...prev,
        {
          ID: maxId + 1,
          MDL_SQ: "",
          DEVICE_SN: "",
          DEVICE_BUY_DT: "",
          DEVICE_INSTL_DT: "",
        },
      ];
    });
  };

  useEffect(getModelList, []);

  return (
    <InputContainer>
      {deviceList?.map((item) => (
        <DeviceRow key={item?.ID}>
          <Left>
            <Select
              value={findValue(item?.ID)?.MDL_SQ}
              onChange={(e: SelectChangeEvent) =>
                changeDeviceValue(item?.ID, "MDL_SQ", e?.target?.value)
              }
            >
              <option value="">모델을 선택해주세요.</option>
              {modelList?.map((model) => (
                <option key={model?.MDL_SQ} value={model?.MDL_SQ}>
                  {model?.MDL_NM} ({model?.MDL_EN_NM})
                </option>
              ))}
            </Select>
            <DeviceInput
              style={{ width: "calc(100% - 170px - 10px)" }}
              value={findValue(item?.ID)?.DEVICE_SN}
              onChange={(e: InputChangeEvent) =>
                changeDeviceValue(item?.ID, "DEVICE_SN", e?.target?.value)
              }
              placeholder="시리얼 번호"
            />
            <Label htmlFor="BUY">구매일</Label>
            <DeviceInput
              id="BUY"
              type="date"
              value={findValue(item?.ID)?.DEVICE_BUY_DT}
              onChange={(e: InputChangeEvent) =>
                changeDeviceValue(item?.ID, "DEVICE_BUY_DT", e?.target?.value)
              }
              placeholder="구매일"
            />
            <Label htmlFor="INSTL">설치일</Label>
            <DeviceInput
              id="INSTL"
              type="date"
              value={findValue(item?.ID)?.DEVICE_INSTL_DT}
              onChange={(e: InputChangeEvent) =>
                changeDeviceValue(item?.ID, "DEVICE_INSTL_DT", e?.target?.value)
              }
              placeholder="설치일"
            />
          </Left>
          <DeviceDelBtn onClick={() => remoteDevice(item?.ID)}>
            <FiMinus />
          </DeviceDelBtn>
        </DeviceRow>
      ))}
      <DeviceAddBtn onClick={addDevice}>
        <FiPlus />
      </DeviceAddBtn>
    </InputContainer>
  );
}
