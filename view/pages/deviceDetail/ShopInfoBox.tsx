import _React from "react";
import { InfoBox, InfoBoxTitle, Row } from ".";
import { ShopInfoBoxProps } from "./index.type";

export default function ShopInfoBox({ data }: ShopInfoBoxProps) {
  return (
    <InfoBox>
      <InfoBoxTitle>피부샵 정보</InfoBoxTitle>
      <Row>상호명: {data?.SHOP_NM ?? "-"}</Row>
      <Row>연락처: {data?.SHOP_NUM ?? "-"}</Row>
      <Row>주소: {data?.SHOP_ADD ?? "-"}</Row>
      <Row>구매일자: {data?.DEVICE_BUY_DT ?? "-"}</Row>
      <Row>설치일자: {data?.DEVICE_INSTL_DT ?? "-"}</Row>
    </InfoBox>
  );
}
