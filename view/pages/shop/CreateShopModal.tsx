import _React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  DeviceModel,
  InputChangeEvent,
  SelectChangeEvent,
} from "../../../types";
import _Input from "../../common/Input";
import _Button from "../../common/Button";
import Modal from "../../common/Modal";
import { Device, Props, Value } from "./index.type";
import _Select from "../../common/Select";
import { useAddress, useAxios, usePhoneNumber } from "../../../functions/utils";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch } from "react-redux";

export default function CreateShopModal({ title, getList, close }: Props) {
  const dispatch = useDispatch();
  const [modelList, setModelList] = useState<DeviceModel[]>([]);
  const [value, setValue] = useState<Value>({
    SHOP_NM: "",
    SHOP_NUM: "",
    SHOP_ADD: "",
    SHOP_ADD_DTL: "",
    MNG_NM: "",
    MNG_NUM: "",
    MNG_GD: 1,
    MNG_ID: "",
    MNG_PW1: "",
    MNG_PW2: "",
  });
  const shopNmRef = useRef(null);
  const shopNumRef = useRef(null);
  const shopAddRef = useRef(null);
  const managerNmRef = useRef(null);
  const managerNumRef = useRef(null);
  const managerIdRef = useRef(null);
  const managerPw1Ref = useRef(null);
  const managerPw2Ref = useRef(null);
  const [deviceList, setDeviceList] = useState<Device[]>([
    {
      ID: 1,
      MDL_SQ: "",
      DEVICE_SN: "",
      DEVICE_BUY_DT: "",
      DEVICE_INSTL_DT: "",
    },
  ]);

  // 모델 리스트 조회
  const getModelList = (): void => {
    useAxios.get("/model").then(({ data }) => {
      if (!data?.result) return setModelList([]);
      setModelList(data?.current);
    });
  };

  // Value 변경
  const changeValue = (key: string, val: any): void => {
    setValue((prev) => ({ ...prev, [key]: val }));
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

  // 장비 삭제
  const remoteDevice = (id: number): void => {
    setDeviceList((prev) => prev?.filter((x) => x?.ID !== id));
  };

  // 경고 메시지
  const useAlert = (ref: any, text: string) => {
    dispatch({ type: "alert", payload: { type: "warning", text: text } });
    if (ref?.current) ref?.current?.focus();
  };

  // 전송
  const submit = (): void => {
    let form = {
      SHOP_NM: value?.SHOP_NM,
      SHOP_NUM: value?.SHOP_NUM,
      SHOP_ADD: value?.SHOP_ADD,
      SHOP_ADD_DTL: value?.SHOP_ADD_DTL,
      MNG_NM: value?.MNG_NM,
      MNG_NUM: value?.MNG_NUM,
      MNG_GD: value?.MNG_GD,
      MNG_ID: value?.MNG_ID,
      MNG_PW: value?.MNG_PW1,
      DEVICE_LIST: deviceList,
    };

    useAxios.post("/shop", form).then(({ data }) => {
      if (!data?.result) return useAlert(null, data?.message);

      useAlert(null, "추가되었습니다.");
      close();
      getList();
    });
  };

  // 유효성 체크
  const validate = (): void => {
    // 피부샵, 매니저 정보 Validate
    if (!value?.SHOP_NM || value?.SHOP_NM?.length < 2)
      return useAlert(shopNmRef, "피부샵 이름을 입력해주세요.");

    if (!value?.SHOP_NUM || value?.SHOP_NUM?.length < 12)
      return useAlert(shopNumRef, "피부샵 연락처를 입력해주세요.");

    if (!value?.SHOP_ADD)
      return useAlert(shopAddRef, "피부샵 주소를 입력해주세요.");

    if (!value?.MNG_NM || value?.MNG_NM?.length < 2)
      return useAlert(managerNmRef, "매니저 이름을 입력해주세요.");

    if (!value?.MNG_NUM || value?.MNG_NUM?.length < 12)
      return useAlert(managerNumRef, "매니저 연락처를 입력해주세요.");

    if (!value?.MNG_ID || value?.MNG_ID?.length < 6)
      return useAlert(
        managerIdRef,
        "매니저 아이디를 입력해주세요. (6자리 이상)"
      );

    if (!value?.MNG_PW1 || value?.MNG_PW1?.length < 6)
      return useAlert(
        managerPw1Ref,
        "매니저 패스워드를 입력해주세요. (6자리 이상)"
      );

    if (!value?.MNG_PW2)
      return useAlert(managerPw2Ref, "매니저 패스워드를 입력해주세요.");

    if (value?.MNG_PW1 !== value?.MNG_PW2)
      return useAlert(managerPw2Ref, "매니저 패스워드가 같지 않습니다.");

    // 피부샵, 매니저 정보 Validate
    let isDevicePass = true;
    deviceList?.forEach((item: any) => {
      let keys = Object.keys(item);
      keys?.forEach((key) => {
        if (!item[key]) {
          isDevicePass = false;
          useAlert(null, "장비 정보를 모두 적어주세요.");
        }
      });
    });

    if (!isDevicePass) return;
    submit();
  };

  useEffect(getModelList, []);

  return (
    <Modal
      title={title}
      close={close}
      size={500}
      bgColor="#E7E7F1"
      buttons={[{ id: 1, name: "추 가", onClick: () => validate() }]}
    >
      <>
        {/* 피부샵 정보 */}
        <Section>
          <SectionTitle>피부샵 정보</SectionTitle>
          <InputContainer>
            <Input
              col={2}
              childRef={shopNmRef}
              placeholder="이름을 입력해주세요."
              value={value?.SHOP_NM}
              onChange={(e: InputChangeEvent) =>
                changeValue("SHOP_NM", e?.target?.value)
              }
            />
            <Input
              col={2}
              childRef={shopNumRef}
              maxLength={13}
              placeholder="연락처를 입력해주세요."
              value={value?.SHOP_NUM}
              onChange={(e: InputChangeEvent) =>
                changeValue("SHOP_NUM", usePhoneNumber(e?.target?.value))
              }
            />
            <Input
              readOnly
              col={2}
              childRef={shopAddRef}
              placeholder="주소검색 (클릭)"
              value={value?.SHOP_ADD}
              onClick={() => {
                useAddress(({ address }) => changeValue("SHOP_ADD", address));
              }}
              style={{ cursor: "pointer", color: "#999" }}
            />
            <Input
              col={2}
              placeholder="상세주소를 입력해주세요."
              value={value?.SHOP_ADD_DTL}
              onChange={(e: InputChangeEvent) =>
                changeValue("SHOP_ADD_DTL", e?.target?.value)
              }
            />
          </InputContainer>
        </Section>

        {/* 대표 매니저 정보 */}
        <Section>
          <SectionTitle>대표 매니저 정보</SectionTitle>
          <InputContainer>
            <Input
              col={3}
              childRef={managerNmRef}
              placeholder="이름을 입력해주세요."
              value={value?.MNG_NM}
              onChange={(e: InputChangeEvent) =>
                changeValue("MNG_NM", e?.target?.value)
              }
            />
            <Input
              col={3}
              childRef={managerNumRef}
              maxLength={13}
              placeholder="연락처를 입력해주세요."
              value={value?.MNG_NUM}
              onChange={(e: InputChangeEvent) =>
                changeValue("MNG_NUM", usePhoneNumber(e?.target?.value))
              }
            />
            <GenderInput>
              <GenderItem
                className={value?.MNG_GD === 1 ? "active" : ""}
                onClick={() => changeValue("MNG_GD", 1)}
              >
                남자
              </GenderItem>
              <GenderItem
                className={value?.MNG_GD === 2 ? "active" : ""}
                onClick={() => changeValue("MNG_GD", 2)}
              >
                여자
              </GenderItem>
            </GenderInput>
            <Input
              col={3}
              childRef={managerIdRef}
              placeholder="아이디를 입력해주세요."
              value={value?.MNG_ID}
              onChange={(e: InputChangeEvent) =>
                changeValue("MNG_ID", e?.target?.value)
              }
            />
            <Input
              type="password"
              col={3}
              childRef={managerPw1Ref}
              placeholder="패스워드를 입력해주세요."
              value={value?.MNG_PW1}
              onChange={(e: InputChangeEvent) =>
                changeValue("MNG_PW1", e?.target?.value)
              }
            />
            <Input
              type="password"
              col={3}
              childRef={managerPw2Ref}
              placeholder="패스워드를 입력해주세요."
              value={value?.MNG_PW2}
              onChange={(e: InputChangeEvent) =>
                changeValue("MNG_PW2", e?.target?.value)
              }
            />
          </InputContainer>
        </Section>

        {/* 장비 정보 */}
        <Section>
          <SectionTitle>장비 정보</SectionTitle>
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
                    placeholder="일련번호"
                  />
                  <Label htmlFor="BUY">구매일</Label>
                  <DeviceInput
                    id="BUY"
                    type="date"
                    value={findValue(item?.ID)?.DEVICE_BUY_DT}
                    onChange={(e: InputChangeEvent) =>
                      changeDeviceValue(
                        item?.ID,
                        "DEVICE_BUY_DT",
                        e?.target?.value
                      )
                    }
                    placeholder="구매일"
                  />
                  <Label htmlFor="INSTL">설치일</Label>
                  <DeviceInput
                    id="INSTL"
                    type="date"
                    value={findValue(item?.ID)?.DEVICE_INSTL_DT}
                    onChange={(e: InputChangeEvent) =>
                      changeDeviceValue(
                        item?.ID,
                        "DEVICE_INSTL_DT",
                        e?.target?.value
                      )
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
        </Section>
      </>
    </Modal>
  );
}

const Section = styled.article`
  margin-bottom: 30px;
`;
const SectionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;
export const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
export const Input = styled(_Input)`
  width: ${(x: { col: 1 | 2 | 3 }) =>
    x?.col === 1
      ? "100%"
      : x?.col === 2
      ? "calc(50% - 2.5px)"
      : "calc(33.33% - 3.3px)"};
  height: 38px;
  line-height: 38px;
  margin-top: 5px;
`;
export const GenderInput = styled.div`
  width: 112px;
  height: 38px;
  margin-top: 5px;
  margin-right: calc(33.33% - 3.3px - 112px);
  display: flex;
  background-color: #fff;
  border-radius: 100px;
  overflow: hidden;
`;
export const GenderItem = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #aaa;
  border-radius: 100px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: #777777;
  }
  &.active {
    background-color: #8b61dc;
    color: #fff;
  }
`;
export const DeviceRow = styled.div`
  width: 100%;
  display: flex;
  padding-left: 10px;
  margin-top: 5px;
  position: relative;

  &::before {
    content: "";
    left: 0;
    bottom: 0;
    width: 4px;
    height: calc(100% - 5px);
    background-color: #926fd7;
    position: absolute;
  }
`;
export const Left = styled.div`
  flex: 1;
`;
export const DeviceDelBtn = styled(_Button)`
  width: 50px;
  margin-top: 5px;
  height: calc(100% - 5px);
  border: none;
  box-shadow: none;
  color: #fff;
  background-color: #f16969;
  &:hover {
    background-color: #e75454;
  }
  &:active {
    background-color: #e02a2a;
  }
`;
export const Select = styled(_Select)`
  margin-top: 5px;
  margin-right: 5px;
  width: 170px;
  height: 38px;
`;
export const DeviceInput = styled(Input)`
  width: unset;
  flex: 1;
  margin-right: 5px;
  color: #999999;
  &:focus {
    color: #000000;
  }
`;
export const DeviceAddBtn = styled(_Button)`
  width: 100%;
  height: 32px;
  margin: 10px 0;
`;
export const Label = styled.label`
  font-size: 12px;
  color: #777777;
  margin-left: 5px;
  margin-right: 6px;
`;
