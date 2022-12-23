import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import _Container from "../../common/Container";
import { Count, Data } from "./index.type";
import { BiChevronRight } from "react-icons/bi";
import { useAxios } from "../../../functions/utils";
import { Shop } from "../../../types";
import { CircularProgress } from "@mui/material";
import { addrColors } from "../../../string";
import Box from "./Box";
import { AddressData, ShopData } from "../../../controllers/dashboard";

const currentDepth: string[] = ["지역별 보기"];

// 센터 수
// 장비수, 누적횟수/시간, ON 장비수, START 장비수, 가스교체필요장비수, 플라즈마 전류 이상 장비 수
export default function Index() {
  const [loading, setLoading] = useState<boolean>(true);
  const [depth, setDepth] = useState<string[]>(currentDepth);
  const [data, setData] = useState<Data[]>([]);
  const [activeAddress, setActiveAddress] = useState<number>(0);

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
    useAxios.get("/dashboard").then(({ data }) => {
      if (!data?.result) return changeData([]);

      let list: Data[] = data?.current?.map((item: AddressData) => ({
        ...item,
        TITLE: item?.ADDR_NM,
      }));
      changeData(list);
    });
  };

  // 피부샵 별 리스트 조회
  const getShopList = (): void => {
    if (!activeAddress) return;

    useAxios.get("/dashboard/" + activeAddress).then(({ data }) => {
      if (!data?.result) return changeData([]);

      let list: Data[] = data?.current?.map((item: ShopData) => ({
        ...item,
        TITLE: item?.SHOP_NM,
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
    if (!i) {
      setActiveAddress(0);
      return setDepth(currentDepth);
    }

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
        ) : data?.length > 0 ? (
          data?.map((item, i) => (
            <Box
              key={i}
              id={(isAddr ? item?.ADDR_SQ : item?.SHOP_SQ) as number}
              name={item?.TITLE}
              data={item}
              color={colorData(i)}
              isAddr={isAddr}
              setDepth={setDepth}
              setActiveAddress={setActiveAddress}
            />
          ))
        ) : (
          <NoneList />
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
const NoneList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "해당 지역에 피부샵이 없습니다.";
    font-size: 30px;
    font-weight: 500;
    color: #ccc;
  }
`;
