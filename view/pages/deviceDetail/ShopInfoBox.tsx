import _React, { useMemo } from "react";
import { InfoBox, InfoBoxTitle, Row } from ".";
import { ShopInfoBoxProps } from "./index.type";

export default function ShopInfoBox({ data }: ShopInfoBoxProps) {
  const address = useMemo<string>(() => {
    if (!data?.SHOP_ADD) return "-";
    if (!data?.SHOP_ADD_DTL) return data?.SHOP_ADD;
    return data?.SHOP_ADD + " " + data?.SHOP_ADD_DTL;
  }, [data]);

  return (
    <InfoBox>
      <InfoBoxTitle>피부샵 정보</InfoBoxTitle>
      <Row>상호명: {data?.SHOP_NM ?? "-"}</Row>
      <Row>연락처: {data?.SHOP_NUM ?? "-"}</Row>
      <Row>주소: {address}</Row>
      <Row>구매일자: {data?.DEVICE_BUY_DT ?? "-"}</Row>
      <Row>설치일자: {data?.DEVICE_INSTL_DT ?? "-"}</Row>
    </InfoBox>
  );
}
