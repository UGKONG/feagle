import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Shop } from "../../../types";
import Button from "../../common/Button";
import _Container from "../../common/Container";
import Dot from "../../common/Dot";
import NoneItem from "../../common/NoneItem";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import CreateShopModal from "./CreateShopModal";
import { Active, FilterList, HeaderList } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "이름" },
  { id: 2, name: "장비수" },
  { id: 3, name: "생성일" },
];
const headerList: HeaderList = [
  "No",
  "이름",
  "연락처",
  "매니저 이름",
  "장비수",
  "생성일",
  "활성화 여부",
];

export default function Shop() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [shopList, setShopList] = useState<Shop[]>([]);
  const [isCreateShopModal, setIsCreateShopModal] = useState<boolean>(false);

  const resultShopList = useMemo<Shop[]>(() => {
    let copy = [...shopList];
    let json = JSON.stringify;
    let q = activeFilter?.filter?.replace(/ /g, "");
    let sort = activeFilter?.sort;
    let isUp = activeFilter?.dir === "ASC";

    // 검색어
    if (q) {
      copy = copy?.filter((x) => json(x)?.replace(/ /g, "")?.indexOf(q) > -1);
    }

    // 솔팅 타입 (1 - 이름 / 2 - 장비수 / 3 - 생성일)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up = a?.SHOP_NM < b?.SHOP_NM ? -1 : a?.SHOP_NM > b?.SHOP_NM ? 1 : 0;
        let down =
          a?.SHOP_NM > b?.SHOP_NM ? -1 : a?.SHOP_NM < b?.SHOP_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up = (a?.DEVICE_COUNT ?? 0) - (b?.DEVICE_COUNT ?? 0);
        let down = (b?.DEVICE_COUNT ?? 0) - (a?.DEVICE_COUNT ?? 0);
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let aDate: Date = new Date(a?.SHOP_CRT_DT as string);
        let bDate: Date = new Date(b?.SHOP_CRT_DT as string);
        let up = aDate.getTime() - bDate.getTime();
        let down = bDate.getTime() - aDate.getTime();
        return isUp ? up : down;
      });
    }

    return copy;
  }, [shopList, activeFilter]);

  const getShopList = () => {
    useAxios.get("/shop").then(({ data }) => {
      setIsLoading(false);
      setShopList(data?.current);
    });
  };

  useEffect(getShopList, []);

  return (
    <Container isLoading={isLoading}>
      <TableHeaderContainer
        list={filterList}
        active={activeFilter}
        setActive={setActiveFilter}
        count={resultShopList?.length}
        buttons={[
          {
            id: 1,
            name: "피부샵 추가",
            onClick: () => setIsCreateShopModal(true),
          },
        ]}
      />
      <List>
        <Table>
          <THeader>
            <tr>
              {headerList?.map((item) => (
                <Column key={item}>{item}</Column>
              ))}
            </tr>
          </THeader>
          <TBody>
            {!resultShopList?.length ? (
              <NoneItem colSpan={headerList} />
            ) : (
              resultShopList?.map((item, i) => (
                <Tr
                  key={item?.SHOP_SQ}
                  onClick={() => navigate("/shop/" + item?.SHOP_SQ)}
                >
                  <Td>{i + 1}</Td>
                  <Td>{item?.SHOP_NM ?? "-"}</Td>
                  <Td>{item?.SHOP_NUM ?? "-"}</Td>
                  <Td>{item?.MNG_NM ?? "-"}</Td>
                  <Td>{item?.DEVICE_COUNT ?? "0"}개</Td>
                  <Td>{item?.SHOP_CRT_DT ?? "-"}</Td>
                  <Td>
                    <Dot isActive={item?.ACTIVE_COUNT ? true : false} />
                  </Td>
                </Tr>
              ))
            )}
          </TBody>
        </Table>
      </List>

      {isCreateShopModal && (
        <CreateShopModal
          title="피부샵 추가"
          getList={getShopList}
          close={() => setIsCreateShopModal(false)}
        />
      )}
    </Container>
  );
}

const Container = styled(_Container)``;
const List = styled.section`
  width: 100%;
  height: calc(100% - 50px);
  position: relative;
  overflow: auto;
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
