import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import _Container from "../../common/Container";
import { AddressData, ShopData } from "./index.type";
import { BiChevronRight } from "react-icons/bi";
import { useAxios } from "../../../functions/utils";
import { Shop } from "../../../types";
import Box from "./Box";
import { CircularProgress } from "@mui/material";

const currentDeps: string[] = ["지역별 보기"];

export default function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [deps, setDeps] = useState<string[]>(currentDeps);
  const [data, setData] = useState<(AddressData | ShopData)[]>([]);

  const isAddr = useMemo<boolean>(() => deps?.length <= 1, [deps]);

  const getAddressList = (): void => {
    let list = [
      {
        ADDR_NM: "강원도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
      {
        ADDR_NM: "경기도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
      {
        ADDR_NM: "경상도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
      {
        ADDR_NM: "전라도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
      {
        ADDR_NM: "충청도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
      {
        ADDR_NM: "제주도",
        SHOP_COUNT: 100,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      },
    ];

    changeData(list);
  };

  const getShopList = (): void => {
    useAxios.get("/shop").then(({ data }) => {
      const list = data?.current?.map((x: Shop) => ({
        SHOP_SQ: x?.SHOP_SQ,
        SHOP_NM: x?.SHOP_NM,
        DEVICE_COUNT: 100,
        USE_TIME: 100,
        USE_COUNT: 100,
      }));

      changeData(list);
    });
  };

  const changeData = (data: (AddressData | ShopData)[]): void => {
    setData(data);
    setTimeout(() => setLoading(false), 200);
  };

  const getData = (): void => {
    setLoading(true);
    (isAddr ? getAddressList : getShopList)();
  };

  const titleClick = (i: number): void => {
    if (!i) return setDeps(currentDeps);

    setDeps((prev) => {
      let copy = [...prev];
      copy = copy?.slice(0, i + 1);
      return copy;
    });
  };

  useEffect(getData, [deps]);

  return (
    <Container>
      <Header>
        <HeaderSide dir="left">
          {deps?.map((item, i) => (
            <React.Fragment key={i}>
              <HeaderTitle color="#444" onClick={() => titleClick(i)}>
                {item}
              </HeaderTitle>
              {i < deps?.length - 1 && <RightIcon />}
            </React.Fragment>
          ))}
        </HeaderSide>
        <HeaderSide dir="right">
          <TotalText>
            <HeaderText color="#22aa0b">피부샵 수: {100}개</HeaderText>
            <HeaderText color="#ff8000">장비 수: {100}개</HeaderText>
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
              id={isAddr ? 0 : (item as ShopData)?.SHOP_SQ}
              type={isAddr ? "address" : "shop"}
              name={
                isAddr
                  ? (item as AddressData)?.ADDR_NM
                  : (item as ShopData)?.SHOP_NM
              }
              setDeps={setDeps}
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
