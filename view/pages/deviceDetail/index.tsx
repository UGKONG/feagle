import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios, useIsNumber } from "../../../functions/utils";
import _Container from "../../common/Container";
import _Button from "../../common/Button";
import Modal from "../../common/Modal";
import { Device, DeviceDo, InputChangeEvent } from "../../../types";
import DefaultInfoBox from "./DefaultInfoBox";
import StateInfoBox from "./StateInfoBox";
import ShopInfoBox from "./ShopInfoBox";
import HistoryList from "../history";
import DeviceDoList from "../deviceDo";
import _Input from "../../common/Input";
import { useSelector } from "react-redux";
import { Store } from "../../../functions/store";
import UseChartModal from "./UseChartModal";
import DataChartModal from "./DataChartModal";

export default function DeviceDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMST = useSelector((x: Store) => x?.master);
  const DEVICE_SQ = params?.id;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUseChartModal, setIsUseChartModal] = useState<boolean>(false);
  const [isDataChartModal, setIsDataChartModal] = useState<boolean>(false);
  const [deviceData, setDeviceData] = useState<Device | null>(null);
  const [deviceDoList, setDeviceDoList] = useState<DeviceDo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  // 장비 조치 리스트 조회
  const getDeviceDoList = (): void => {
    if (!DEVICE_SQ || !useIsNumber(DEVICE_SQ)) return navigate(-1);
    useAxios.get("/deviceDo/" + DEVICE_SQ).then(({ data }) => {
      setIsLoading(false);
      setDeviceDoList(data?.current);
    });
  };

  // 장비 조치 등록
  const submit = (): void => {
    if (!inputValue) return inputRef?.current?.focus();

    let form = {
      DEVICE_SQ: Number(DEVICE_SQ),
      DO_CN: inputValue,
      MST_SQ: loginMST?.MST_SQ,
    };

    useAxios.post("/deviceDo", form).then(({ data }) => {
      if (!data?.result) return useAlert("error", "등록에 실패하였습니다.");

      // Success
      useAlert("success", "등록되었습니다.");
      getDeviceDoList();
      setInputValue("");
      inputRef?.current?.focus();
    });
  };

  // 장비 정보 조회
  const getDeviceData = (): void => {
    if (!DEVICE_SQ || !useIsNumber(DEVICE_SQ)) return navigate(-1);
    useAxios.get("/device/" + DEVICE_SQ).then(({ data }) => {
      getDeviceDoList();

      setDeviceData(data?.current);

      dispatch({
        type: "customTitle",
        payload: data?.current?.DEVICE_SN + " 장비",
      });
    });
  };

  useEffect(getDeviceData, [DEVICE_SQ]);

  return (
    <>
      <Container isLoading={isLoading}>
        <InfoBoxContainer>
          <DefaultInfoBox data={deviceData} />
          <StateInfoBox
            data={deviceData}
            setIsDataChartModal={setIsDataChartModal}
            setIsUseChartModal={setIsUseChartModal}
          />
          <ShopInfoBox data={deviceData} />
        </InfoBoxContainer>

        <SectionTitle>조치이력</SectionTitle>
        <DeviceDoList currentList={deviceDoList} />
        <InputContainer>
          <Input
            childRef={inputRef}
            value={inputValue}
            onKeyDown={(e: React.KeyboardEvent) =>
              e?.keyCode === 13 && submit()
            }
            onChange={(e: InputChangeEvent) =>
              setInputValue(e?.target?.value ?? "")
            }
            placeholder="조치내용을 적어주세요."
          />
          <SubmitBtn onClick={submit}>등록</SubmitBtn>
        </InputContainer>

        <SectionTitle>히스토리</SectionTitle>
        <HistoryList currentList={deviceData?.HISTORY} isHeader={false} />
      </Container>

      {/* 사용 통계 보기 */}
      {isUseChartModal && (
        <Modal
          title="장비 사용 통계"
          size={1000}
          bgColor="#E7E7F1"
          close={() => setIsUseChartModal(false)}
        >
          <UseChartModal />
        </Modal>
      )}

      {/* 데이터 통계 보기 */}
      {isDataChartModal && (
        <Modal
          title="장비 데이터 통계"
          size={1000}
          bgColor="#E7E7F1"
          close={() => setIsDataChartModal(false)}
        >
          <DataChartModal />
        </Modal>
      )}
    </>
  );
}
const SectionTitle = styled.p`
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #222222;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    display: block;
    flex: 1;
    height: 2px;
    background-color: #8b6ad3aa;
    margin-left: 10px;
  }
`;
const Container = styled(_Container)`
  overflow: auto;
  min-height: calc(100% - 60px);
`;
const InfoBoxContainer = styled.section`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
export const InfoBox = styled.article`
  padding: 10px;
  background-color: #9575d8;
  border-radius: 8px;
  color: #fff;
  flex: 1;
  max-width: calc(33.33% - 5px);
  align-self: stretch;
`;
export const InfoBoxTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`;
export const Row = styled.div`
  font-size: 13px;
  margin-bottom: 10px;
  font-weight: 300;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  width: 100%;
`;
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
`;
const Input = styled(_Input)`
  height: 32px;
  margin-right: 10px;
`;
const SubmitBtn = styled(_Button)`
  height: 32px;
`;
