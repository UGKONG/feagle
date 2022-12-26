import _React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Device } from "../../../types";
import _Container from "../../common/Container";
import NoneItem from "../../common/NoneItem";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "일련번호" },
  { id: 2, name: "모델명" },
  { id: 3, name: "피부샵명" },
  { id: 4, name: "플라즈마 전류" },
  { id: 5, name: "가스 잔량" },
  { id: 6, name: "펌웨어" },
  { id: 7, name: "소프트웨어" },
];
const headerList: HeaderList = [
  "No",
  "일련번호",
  "모델명",
  "피부샵명",
  "플라즈마 전류",
  "가스 잔량",
  "펌웨어",
  "소프트웨어",
];

export default function State({
  isHeader = true,
  currentList,
  isShopNameHide = false,
}: Props) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(currentList ? false : true);
  const [deviceList, setDeviceList] = useState<Device[]>(currentList ?? []);

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
    // (1 - 일련번호, 2 - 모델명, 3 - 피부샵명, 4 - 플라즈마 전류, 5 - 가스 잔량, 6 - 펌웨어, 7 - 소프트웨어)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up: number =
          a?.DEVICE_SN < b?.DEVICE_SN
            ? -1
            : a?.DEVICE_SN > b?.DEVICE_SN
            ? 1
            : 0;
        let down: number =
          a?.DEVICE_SN > b?.DEVICE_SN
            ? -1
            : a?.DEVICE_SN < b?.DEVICE_SN
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up: number =
          a?.MDL_NM < b?.MDL_NM ? -1 : a?.MDL_NM > b?.MDL_NM ? 1 : 0;
        let down: number =
          a?.MDL_NM > b?.MDL_NM ? -1 : a?.MDL_NM < b?.MDL_NM ? 1 : 0;
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
        let up: number = (a?.PLA_VAL ?? 0) - (b?.PLA_VAL ?? 0);
        let down: number = (b?.PLA_VAL ?? 0) - (a?.PLA_VAL ?? 0);
        return isUp ? up : down;
      });
    } else if (sort === 5) {
      copy?.sort((a, b) => {
        let up: number = (a?.GAS_VAL ?? 0) - (b?.GAS_VAL ?? 0);
        let down: number = (b?.GAS_VAL ?? 0) - (a?.GAS_VAL ?? 0);
        return isUp ? up : down;
      });
    } else if (sort === 6) {
      copy?.sort((a, b) => {
        let up: number =
          a?.DEVICE_FW_VN < b?.DEVICE_FW_VN
            ? -1
            : a?.DEVICE_FW_VN > b?.DEVICE_FW_VN
            ? 1
            : 0;
        let down: number =
          a?.DEVICE_FW_VN > b?.DEVICE_FW_VN
            ? -1
            : a?.DEVICE_FW_VN < b?.DEVICE_FW_VN
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 7) {
      copy?.sort((a, b) => {
        let up: number =
          a?.DEVICE_SW_VN < b?.DEVICE_SW_VN
            ? -1
            : a?.DEVICE_SW_VN > b?.DEVICE_SW_VN
            ? 1
            : 0;
        let down: number =
          a?.DEVICE_SW_VN > b?.DEVICE_SW_VN
            ? -1
            : a?.DEVICE_SW_VN < b?.DEVICE_SW_VN
            ? 1
            : 0;
        return isUp ? up : down;
      });
    }

    return copy;
  }, [deviceList, activeFilter]);

  const getShopList = () => {
    if (currentList) return;
    useAxios.get("/device").then(({ data }) => {
      setIsLoading(false);
      setDeviceList(data?.current);
    });
  };

  useEffect(getShopList, [currentList]);

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
                  <Td>{item?.PLA_VAL ? item?.PLA_VAL + "mA" : "-"}</Td>
                  <Td>{item?.GAS_VAL ? item?.GAS_VAL + "%" : "-"}</Td>
                  <Td>{item?.DEVICE_FW_VN ?? "-"}</Td>
                  <Td>{item?.DEVICE_SW_VN ?? "-"}</Td>
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
