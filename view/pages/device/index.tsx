import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Device } from "../../../types";
import _Container from "../../common/Container";
import Dot from "../../common/Dot";
import NoneItem from "../../common/NoneItem";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "일련번호" },
  { id: 2, name: "모델명" },
  { id: 3, name: "피부샵명" },
  { id: 4, name: "누적사용시간" },
  { id: 5, name: "가동 횟수" },
  { id: 6, name: "최근사용일시" },
  { id: 7, name: "현재상태" },
];
const headerList: HeaderList = [
  "No",
  "일련번호",
  "모델명",
  "피부샵명",
  "누적사용시간",
  "가동 횟수",
  "최근사용일시",
  "현재 상태",
];

export default function Device({
  isHeader = true,
  currentList,
  isShopNameHide = false,
  isJustList = false,
}: Props) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(currentList ? false : true);
  const [deviceList, setDeviceList] = useState<Device[]>([]);

  const resultDeviceList = useMemo<Device[]>(() => {
    let copy = [...deviceList];
    let json = JSON.stringify;
    let q = activeFilter?.filter?.replace(/ /g, "");
    let sort = activeFilter?.sort;
    let isUp = activeFilter?.dir === "ASC";

    // 검색어
    if (q) {
      copy = copy?.filter((x) => json(x)?.replace(/ /g, "")?.indexOf(q) > -1);
    }

    // 솔팅 타입
    // (1 - 일련번호, 2 - 모델명, 3 - 피부샵명, 4 - 누적사용시간, 5 - 가동 횟수, 6 - 최근사용일시, 7 - 현재상태)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up =
          a?.DEVICE_SN < b?.DEVICE_SN
            ? -1
            : a?.DEVICE_SN > b?.DEVICE_SN
            ? 1
            : 0;
        let down =
          a?.DEVICE_SN > b?.DEVICE_SN
            ? -1
            : a?.DEVICE_SN < b?.DEVICE_SN
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up = a?.MDL_NM < b?.MDL_NM ? -1 : a?.MDL_NM > b?.MDL_NM ? 1 : 0;
        let down = a?.MDL_NM > b?.MDL_NM ? -1 : a?.MDL_NM < b?.MDL_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let up: number =
          a?.SHOP_NM < b?.SHOP_NM ? -1 : a?.SHOP_NM > b?.SHOP_NM ? 1 : 0;
        let down: number =
          a?.SHOP_NM > b?.SHOP_NM ? -1 : a?.SHOP_NM < b?.SHOP_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 4) {
      copy?.sort((a, b) => {
        let up: number = (a?.USE_TM_VAL ?? 0) - (b?.USE_TM_VAL ?? 0);
        let down: number = (b?.USE_TM_VAL ?? 0) - (a?.USE_TM_VAL ?? 0);
        return isUp ? up : down;
      });
    } else if (sort === 5) {
      copy?.sort((a, b) => {
        let up: number = (a?.ON_COUNT ?? 0) - (b?.ON_COUNT ?? 0);
        let down: number = (b?.ON_COUNT ?? 0) - (a?.ON_COUNT ?? 0);
        return isUp ? up : down;
      });
    } else if (sort === 6) {
      copy?.sort((a, b) => {
        let aDate: Date = new Date(a?.DEVICE_LAST_DT as string);
        let bDate: Date = new Date(b?.DEVICE_LAST_DT as string);
        let up: number = aDate.getTime() - bDate.getTime();
        let down: number = bDate.getTime() - aDate.getTime();
        return isUp ? up : down;
      });
    } else if (sort === 7) {
      copy?.sort((a, b) => {
        let up: number = (a?.IS_ACTIVE ?? 0) - (b?.IS_ACTIVE ?? 0);
        let down: number = (b?.IS_ACTIVE ?? 0) - (a?.IS_ACTIVE ?? 0);
        return isUp ? up : down;
      });
    }

    return copy;
  }, [deviceList, activeFilter]);

  const getList = () => {
    if (isJustList || currentList) {
      setIsLoading(false);
      return setDeviceList(currentList ?? []);
    }

    useAxios.get("/device").then(({ data }) => {
      setIsLoading(false);
      setDeviceList(data?.current);
    });
  };

  useEffect(getList, [currentList]);

  return (
    <Container isContents={currentList ? true : false} isLoading={isLoading}>
      {isHeader && (
        <TableHeaderContainer
          list={currentList ? [] : filterList}
          active={activeFilter}
          setActive={setActiveFilter}
          count={resultDeviceList?.length}
        />
      )}
      <List height={currentList}>
        <Table>
          <THeader>
            <tr>
              {headerList?.map((item) =>
                (isShopNameHide && item) === "피부샵명" ? null : (
                  <Column key={item}>{item}</Column>
                )
              )}
            </tr>
          </THeader>
          <TBody>
            {!resultDeviceList?.length ? (
              <NoneItem colSpan={headerList} />
            ) : (
              resultDeviceList?.map((item, i) => (
                <Tr
                  key={item?.DEVICE_SQ}
                  onClick={() => navigate("/device/" + item?.DEVICE_SQ)}
                >
                  <Td>{i + 1}</Td>
                  <Td>{item?.DEVICE_SN ?? "-"}</Td>
                  <Td>{item?.MDL_NM ?? "-"}</Td>
                  {!isShopNameHide && <Td>{item?.SHOP_NM ?? "-"}</Td>}
                  <Td>{item?.USE_TM_VAL ? item?.USE_TM_VAL + "시간" : "-"}</Td>
                  <Td>{item?.ON_COUNT ? item?.ON_COUNT + "회" : "-"}</Td>
                  <Td>{item?.DEVICE_LAST_DT ?? "-"}</Td>
                  <Td>
                    <Dot isActive={item?.IS_ACTIVE ? true : false} />
                  </Td>
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      </List>
    </Container>
  );
}

const Container = styled(_Container)``;
const List = styled.section<{ height: any }>`
  width: 100%;
  position: relative;
  overflow: auto;
  height: ${(x) => (x?.height ? "unset" : "calc(100% - 50px)")};
  margin-bottom: ${(x) => (x?.height ? 50 : 0)}px;
`;
const Table = styled.table`
  width: 100%;
`;
const THeader = styled.thead`
  position: sticky;
  top: 0;
  background: #e7e7f1;
`;
const Column = styled.th`
  flex: 1;
  font-size: 13px;
  color: #888888;
  text-align: left;
  font-weight: 500;
  padding: 6px 5px;
`;
const TBody = styled.tbody``;
const Tr = styled.tr`
  cursor: pointer;
  color: #888888;

  &:hover {
    color: #000000;
  }
`;
const Td = styled.td`
  padding: 8px 5px;
  font-size: 13px;
`;
