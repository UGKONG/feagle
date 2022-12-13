import _React from "react";
import { InfoBox, InfoBoxTitle, Row } from ".";
import { DefaultInfoBoxProps } from "./index.type";

export default function DefaultInfoBox({ data }: DefaultInfoBoxProps) {
  return (
    <InfoBox>
      <InfoBoxTitle>장비 정보</InfoBoxTitle>
      <Row>모델명: {data?.MDL_NM ?? "-"}</Row>
      <Row>일련번호: {data?.DEVICE_SN ?? "-"}</Row>
      <Row>펌웨어 버전: {data?.DEVICE_FW_VN ?? "-"}</Row>
      <Row>소프트웨어 버전: {data?.DEVICE_SW_VN ?? "-"}</Row>
    </InfoBox>
  );
}
