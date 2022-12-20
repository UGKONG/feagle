import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import _Container from "../../common/Container";
import { Count, Data } from "./index.type";
import { BiChevronRight } from "react-icons/bi";
import { useAxios } from "../../../functions/utils";
import { Shop } from "../../../types";
import Box from "./Box";
import { CircularProgress } from "@mui/material";
import { addrColors } from "../../../string";

const currentDepth: string[] = ["지역별 보기"];

// 센터 수
// 장비수, 누적횟수/시간, ON 장비수, START 장비수, 가스교체필요장비수, 플라즈마 전류 이상 장비 수
export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [depth, setDepth] = useState<string[]>(currentDepth);
  const [data, setData] = useState<Data[]>([]);

  // 지역 별 / 피부샵 별 구분
  const isAddr = useMemo<boolean>(() => depth?.length <= 1, [depth]);

  // 피부샵 수, 장비 수
  const count = useMemo<Count>(() => {
    let shop: number = 0;
    let device: number = 0;

    if (isAddr) {
      data?.forEach((item) => {
        shop += item?.SHOP_COUNT ?? 0;
        device += item?.DEVICE_COUNT ?? 0;
      });
    } else {
      shop = data?.length;
      data?.forEach((item) => (device += item?.DEVICE_COUNT ?? 0));
    }

    return { shop, device };
  }, [data]);

  // 지역 별 리스트 조회
  const getAddressList = (): void => {
    let list: Data[] = [
      {
        TITLE: "강원도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
      {
        TITLE: "경기도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
      {
        TITLE: "경상도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
      {
        TITLE: "전라도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
      {
        TITLE: "충청도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
      {
        TITLE: "제주도",
        SHOP_COUNT: 125,
        DEVICE_COUNT: 147,
        USE_TIME: 542,
        USE_COUNT: 264,
        ON_DEVICE_COUNT: 26,
        START_DEVICE_COUNT: 53,
        NEED_GAS_DEVICE_COUNT: 12,
        NEED_PLA_DEVICE_COUNT: 3,
      },
    ];

    changeData(list);
  };

  // 피부샵 별 리스트 조회
  const getShopList = (): void => {
    useAxios.get("/shop").then(({ data }) => {
      const list = data?.current?.map((x: Shop) => ({
        SHOP_SQ: x?.SHOP_SQ,
        TITLE: x?.SHOP_NM,
        DEVICE_COUNT: 2,
        USE_TIME: 125,
        USE_COUNT: 56,
        ON_DEVICE_COUNT: 1,
        START_DEVICE_COUNT: 2,
        NEED_GAS_DEVICE_COUNT: 1,
        NEED_PLA_DEVICE_COUNT: 0,
      }));

      changeData(list);
    });
  };

  // 데이터 State에 삽입
  const changeData = (data: Data[]): void => {
    setData(data);
    setLoading(false);
  };

  // 상황에 따라 데이터 조회
  const getData = (): void => {
    setLoading(true);
    (isAddr ? getAddressList : getShopList)();
  };

  // Depth 클릭
  const depthClick = (i: number): void => {
    if (!i) return setDepth(currentDepth);

    setDepth((prev) => {
      let copy = [...prev];
      copy = copy?.slice(0, i + 1);
      return copy;
    });
  };

  // color return
  const colorData = (i: number): string => {
    let calc = i < 10 ? i : i % 10;
    return addrColors[calc];
  };

  useEffect(getData, [depth]);

  return (
    <Container>
      <Header>
        <HeaderSide dir="left">
          {depth?.map((item, i) => (
            <React.Fragment key={i}>
              <HeaderTitle color="#444" onClick={() => depthClick(i)}>
                {item}
              </HeaderTitle>
              {i < depth?.length - 1 && <RightIcon />}
            </React.Fragment>
          ))}
        </HeaderSide>
        <HeaderSide dir="right">
          <TotalText>
            <HeaderText color="#22aa0b">
              피부샵 수: {count?.shop ?? 0}개
            </HeaderText>
            <HeaderText color="#ff8000">
              장비 수: {count?.device ?? 0}개
            </HeaderText>
          </TotalText>
        </HeaderSide>
      </Header>
      <Contents>
        {loading ? (
          <Loading>
            <CircularProgress />
          </Loading>
        ) : (
          data?.map((item, i) => (
            <Box
              key={i}
              id={item?.SHOP_SQ ?? 0}
              name={item?.TITLE}
              data={item}
              setDepth={setDepth}
              color={colorData(i)}
            />
          ))
        )}
      </Contents>
    </Container>
  );
}

const Container = styled(_Container)`
  padding: 0;
`;
const Header = styled.header`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0;
`;
const HeaderSide = styled.div<{ dir: "left" | "right" }>`
  width: 50%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: flex-${(x) => (x?.dir === "left" ? "start" : "end")};
`;
const HeaderTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #444444;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const HeaderText = styled.span<{ color: string }>`
  display: inline-block;
  font-size: 15px;
  margin-left: 20px;
  color: ${(x) => x?.color};
`;
const RightIcon = styled(BiChevronRight)`
  margin: 0 3px;
`;
const Contents = styled.section`
  width: 100%;
  height: calc(100% - 50px);
  padding: 0 10px 10px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
  overflow: auto;
`;
const TotalText = styled.div`
  font-weight: 500;
`;
const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background-color: #00000010;
`;
