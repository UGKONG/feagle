import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import _Container from "../../common/Container";
import { Count, Data } from "./index.type";
import { BiChevronRight } from "react-icons/bi";
import {
  useAxios,
  useIsNumber,
  useQueryObject,
} from "../../../functions/utils";
import { CircularProgress } from "@mui/material";
import { addrColors } from "../../../string";
import Box from "./Box";
import { AddressData, ShopData } from "../../../controllers/dashboard";
import { useLocation, useNavigate } from "react-router-dom";
import { CommonCode } from "../../../types";

const currentDepth: string[] = ["지역별 보기"];

// 센터 수
// 장비수, 누적횟수/시간, ON 장비수, START 장비수, 가스교체필요장비수, 플라즈마 전류 이상 장비 수
export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data[]>([]);
  const [commAddrList, setCommAddrList] = useState<CommonCode[]>([]);

  const getCommAddrList = (): void => {
    useAxios.get("/common/address").then(({ data }) => {
      setCommAddrList(data?.current ?? []);
    });
  };

  const query = useMemo<{ [key: string]: string }>(() => {
    return useQueryObject(location?.search);
  }, [location]);

  // 지역 별 / 피부샵 별 구분
  const isAddr = useMemo<boolean>(() => {
    let keys = Object.keys(query);
    if (!keys?.length) return true;
    return false;
  }, [location]);

  const activeAddress = useMemo(() => {
    let addr = query?.addr;
    if (!useIsNumber(addr)) return 0;
    return Number(query?.addr);
  }, [location]);

  const depth = useMemo<string[]>(() => {
    if (!activeAddress) return [...currentDepth];
    let find = commAddrList?.find((x) => x?.COMM_CODE === activeAddress);
    if (!find) return [...currentDepth];
    return [...currentDepth, find?.COMM_NM];
  }, [activeAddress, commAddrList]);

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
    if (!i) return navigate("/");
  };

  // color return
  const colorData = (i: number): string => {
    let calc = i < 10 ? i : i % 10;
    return addrColors[calc];
  };

  useEffect(getData, [location]);
  useEffect(getCommAddrList, []);

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
