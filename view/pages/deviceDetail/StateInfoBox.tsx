import _React from "react";
import styled from "styled-components";
import { InfoBox, InfoBoxTitle, Row } from ".";
import _Button from "../../common/Button";
import { StateInfoBoxProps } from "./index.type";

export default function StateInfoBox({
  data,
  setIsDataChartModal,
  setIsUseChartModal,
}: StateInfoBoxProps) {
  return (
    <InfoBox>
      <InfoBoxTitle>
        상태 & 사용 정보
        <ButtonContainer>
          <Button onClick={() => setIsUseChartModal(true)}>사용통계</Button>
          <Button onClick={() => setIsDataChartModal(true)}>데이터통계</Button>
        </ButtonContainer>
      </InfoBoxTitle>
      <Row>플라즈마 전류: {data?.PLA_VAL ? data?.PLA_VAL + "㎃" : "-"}</Row>
      <Row>가스 압력: {data?.GAS1_VAL ? data?.GAS1_VAL + "㎫" : "-"}</Row>
      <Row>가스 유량: {data?.GAS2_VAL ? data?.GAS2_VAL + "ℓ/hr" : "-"}</Row>
      <Row>
        가스 잔량: <ProgressContainer percent={data?.GAS_VAL ?? 0} />
        <Percent percent={data?.GAS_VAL ?? 0}>{data?.GAS_VAL}%</Percent>
      </Row>
      <Row>사용 횟수: {data?.ON_COUNT ? data?.ON_COUNT + "회" : "-"}</Row>
      <Row>
        누적 사용 시간: {data?.USE_TM_VAL ? data?.USE_TM_VAL + "시간" : "-"}
      </Row>
    </InfoBox>
  );
}

const ProgressContainer = styled.div<{ percent: number }>`
  flex: 1;
  height: 10px;
  border-radius: 10px;
  margin-left: 5px;
  overflow: hidden;
  background-color: #ddd;

  &::before {
    content: "";
    width: ${(x) => x?.percent}%;
    height: 100%;
    display: block;
    background-color: ${(x) =>
      x?.percent <= 15 ? "#f00" : x?.percent <= 30 ? "#f38536" : "#09b61d"};
  }
`;
const Percent = styled.span<{ percent: number }>`
  margin-left: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${(x) =>
    x?.percent <= 15 ? "#f86565" : x?.percent <= 30 ? "#fc9b57" : "#ddd"};
`;
const ButtonContainer = styled.div`
  display: flex;
`;
const Button = styled(_Button)`
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  margin-left: 5px;
`;
