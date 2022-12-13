import _React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Post } from "../../../types";
import _Container from "../../common/Container";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "카테고리" },
  { id: 2, name: "제목" },
  { id: 3, name: "버전" },
  { id: 4, name: "적용 모델" },
  { id: 5, name: "배포일" },
  { id: 6, name: "작성자" },
  { id: 7, name: "작성일" },
];
const headerList: HeaderList = [
  "No",
  "카테고리",
  "제목",
  "버전",
  "적용 모델",
  "배포일",
  "작성자",
  "작성일",
];

export default function Shop({ isHeader = true, currentList }: Props) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(currentList ? false : true);
  const [deviceList, setDeviceList] = useState<Post[]>(currentList ?? []);

  const resultDeviceList = useMemo<Post[]>(() => {
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
    // (1 - 카테고리, 2 - 제목, 3 - 버전, 4 - 적용 모델, 5 - 배포일, 6 - 작성자, 7 - 작성일)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up =
          a?.POST_TP_NM < b?.POST_TP_NM
            ? -1
            : a?.POST_TP_NM > b?.POST_TP_NM
            ? 1
            : 0;
        let down =
          a?.POST_TP_NM > b?.POST_TP_NM
            ? -1
            : a?.POST_TP_NM < b?.POST_TP_NM
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up =
          a?.POST_TTL < b?.POST_TTL ? -1 : a?.POST_TTL > b?.POST_TTL ? 1 : 0;
        let down =
          a?.POST_TTL > b?.POST_TTL ? -1 : a?.POST_TTL < b?.POST_TTL ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let up: number =
          a?.BUILD_VN < b?.BUILD_VN ? -1 : a?.BUILD_VN > b?.BUILD_VN ? 1 : 0;
        let down: number =
          a?.BUILD_VN > b?.BUILD_VN ? -1 : a?.BUILD_VN < b?.BUILD_VN ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 4) {
      copy?.sort((a, b) => {
        let up: number =
          a?.MDL_NM < b?.MDL_NM ? -1 : a?.MDL_NM > b?.MDL_NM ? 1 : 0;
        let down: number =
          a?.MDL_NM > b?.MDL_NM ? -1 : a?.MDL_NM < b?.MDL_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 5) {
      copy?.sort((a, b) => {
        let up: number =
          a?.BUILD_DT < b?.BUILD_DT ? -1 : a?.BUILD_DT > b?.BUILD_DT ? 1 : 0;
        let down: number =
          a?.BUILD_DT > b?.BUILD_DT ? -1 : a?.BUILD_DT < b?.BUILD_DT ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 6) {
      copy?.sort((a, b) => {
        let up = a?.MST_NM < b?.MST_NM ? -1 : a?.MST_NM > b?.MST_NM ? 1 : 0;
        let down = a?.MST_NM > b?.MST_NM ? -1 : a?.MST_NM < b?.MST_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 7) {
      copy?.sort((a, b) => {
        let up =
          (a?.POST_CRT_DT ?? 0) < (b?.POST_CRT_DT ?? 0)
            ? -1
            : (a?.POST_CRT_DT ?? 0) > (b?.POST_CRT_DT ?? 0)
            ? 1
            : 0;
        let down =
          (a?.POST_CRT_DT ?? 0) > (b?.POST_CRT_DT ?? 0)
            ? -1
            : (a?.POST_CRT_DT ?? 0) < (b?.POST_CRT_DT ?? 0)
            ? 1
            : 0;
        return isUp ? up : down;
      });
    }

    return copy;
  }, [deviceList, activeFilter]);

  const getPostList = () => {
    if (currentList) return;
    useAxios.get("/board?POST_TP=ware").then(({ data }) => {
      setIsLoading(false);
      setDeviceList(data?.current);
    });
  };

  useEffect(getPostList, []);

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
              {headerList?.map((item) => (
                <Column key={item}>{item}</Column>
              ))}
            </tr>
          </THeader>
          <TBody>
            {resultDeviceList?.map((item, i) => (
              <Tr
                key={item?.POST_SQ}
                onClick={() => navigate("/board/" + item?.POST_SQ)}
              >
                <Td>{i + 1}</Td>
                <Td>{item?.POST_TP_NM ?? "-"}</Td>
                <Td>{item?.POST_TTL ?? "-"}</Td>
                <Td>{item?.BUILD_VN ?? "-"}</Td>
                <Td>{item?.MDL_NM ?? "-"}</Td>
                <Td>{item?.BUILD_DT ?? "-"}</Td>
                <Td>{item?.MST_NM ?? "-"}</Td>
                <Td>{item?.POST_CRT_DT ?? "-"}</Td>
              </Tr>
            ))}
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
