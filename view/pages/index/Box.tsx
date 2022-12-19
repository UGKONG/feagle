import _React, { useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BoxProps, Type } from "./index.type";

export default function Box({ id, name, data, color, setDepth }: BoxProps) {
  const navigate = useNavigate();

  // box 클릭
  const boxClick = (): void => {
    if (type === "address") {
      setDepth((prev) => [...prev, name]);
    } else {
      if (!id) return;
      navigate("/shop/" + id);
    }
  };

  // 지역 별 / 피부샵 별 구분
  const type = useMemo<Type>(() => (id === 0 ? "address" : "shop"), [id]);

  // 누적사용정보
  const use = useMemo<string>(() => {
    let count = data?.USE_COUNT ?? 0;
    let time = data?.USE_TIME ?? 0;
    let result = `(누적사용: ${count}회/${time}시간)`;
    return result;
  }, [data?.USE_COUNT, data?.USE_TIME]);

  // 피부샵 수 컴포넌트
  const ShopCount = () => <small>- 피부샵 수: {data?.SHOP_COUNT ?? 0}</small>;

  // 퍼센트 계산
  const percentData = (number: number): number => {
    if (!data?.DEVICE_COUNT || !number) return 0;
    let percent = (number / data?.DEVICE_COUNT) * 100;
    return percent;
  };

  return (
    <>
      <Container color={color} onClick={boxClick}>
        <Title>
          {type === "shop" && "피부샵명: "}
          {name} {type === "address" && <ShopCount />}
        </Title>

        <SubTitle>
          장비: {data?.DEVICE_COUNT ?? 0}대 {use}
        </SubTitle>

        <Contents>
          <Row>
            <RowTitle>현재 구동 장비</RowTitle>
            <Progress
              percent={percentData(data?.ON_DEVICE_COUNT)}
              color="#89c963"
            />
            {data?.ON_DEVICE_COUNT ?? 0}대
          </Row>
          <Row>
            <RowTitle>현재 사용 장비</RowTitle>
            <Progress
              percent={percentData(data?.START_DEVICE_COUNT)}
              color="#89c963"
            />
            {data?.START_DEVICE_COUNT ?? 0}대
          </Row>

          <Row>
            <RowTitle>가스 교체 필요</RowTitle>
            <Progress
              percent={percentData(data?.NEED_GAS_DEVICE_COUNT)}
              color="#e96262"
            />
            {data?.NEED_GAS_DEVICE_COUNT ?? 0}대
          </Row>
          <Row>
            <RowTitle>플라즈마 이상</RowTitle>
            <Progress
              percent={percentData(data?.NEED_PLA_DEVICE_COUNT)}
              color="#e96262"
            />
            {data?.NEED_PLA_DEVICE_COUNT ?? 0}대
          </Row>
        </Contents>
      </Container>
    </>
  );
}

const Container = styled.article<{ color: string }>`
  display: flex;
  flex-direction: column;
  width: calc(25% - 8px);
  min-height: 100px;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  transition: 0.3s;
  margin-right: 10px;
  cursor: pointer;
  background-color: ${(x) => x?.color ?? "#8a65da"};

  &:nth-of-type(4n) {
    margin-right: 0;
  }

  &:hover {
    background-color: ${(x) => (x?.color ? x?.color?.slice(0, 7) : "#7a53d0")};
  }

  @media screen and (max-width: 1800px) {
    width: calc(33.33% - 7px);

    &:nth-of-type(4n) {
      margin-right: 10px;
    }
    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1300px) {
    width: calc(50% - 5px);

    &:nth-of-type(3n) {
      margin-right: 10px;
    }
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1000px) {
    width: 100%;

    &:nth-of-type(2n) {
      margin-right: 10px;
    }
    &:nth-of-type(1n) {
      margin-right: 0;
    }
  }
`;
const Title = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SubTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  letter-spacing: 1px;
`;
const Contents = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  width: 100%;
  margin-bottom: 8px;
  font-size: 15px;
  letter-spacing: 1px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const RowTitle = styled.p`
  width: 120px;
`;
const Progress = styled.div<{ percent: number }>`
  flex: 1;
  height: 12px;
  border-radius: 100px;
  margin: 0 10px;
  background-color: #eee;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    width: ${(x) => x?.percent}%;
    height: 100%;
    background-color: ${(x) => x?.color ?? "#89c963"};
  }
`;
