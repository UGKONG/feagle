import _React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Master } from "../../../types";
import _Container from "../../common/Container";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "이름" },
  { id: 2, name: "부서" },
  { id: 3, name: "직급" },
  { id: 4, name: "성별" },
  { id: 5, name: "권한" },
  { id: 6, name: "가입일" },
];
const headerList: HeaderList = [
  "No",
  "이름",
  "부서",
  "직급",
  "성별",
  "연락처",
  "아이디",
  "권한",
  "가입일",
];

export default function Shop({ isHeader = true, currentList }: Props) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(currentList ? false : true);
  const [masterList, setMasterList] = useState<Master[]>(currentList ?? []);

  const resultMasterList = useMemo<Master[]>(() => {
    let copy = [...masterList];
    let json = JSON.stringify;
    let q = activeFilter?.filter?.replace(/ /g, "");
    let sort = activeFilter?.sort;
    let isUp = activeFilter?.dir === "ASC";

    // 검색어
    if (q) {
      copy = copy?.filter((x) => json(x)?.replace(/ /g, "")?.indexOf(q) > -1);
    }

    // 솔팅 타입
    // (1 - 부서, 2 - 직급, 3 - 이름, 4 - 성별, 5 - 권한, 6 - 가입일)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up =
          (a?.MST_GRP ?? "") < (b?.MST_GRP ?? "")
            ? -1
            : (a?.MST_GRP ?? "") > (b?.MST_GRP ?? "")
            ? 1
            : 0;
        let down =
          (a?.MST_GRP ?? "") > (b?.MST_GRP ?? "")
            ? -1
            : (a?.MST_GRP ?? "") < (b?.MST_GRP ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up =
          (a?.MST_PO ?? "") < (b?.MST_PO ?? "")
            ? -1
            : (a?.MST_PO ?? "") > (b?.MST_PO ?? "")
            ? 1
            : 0;
        let down =
          (a?.MST_PO ?? "") > (b?.MST_PO ?? "")
            ? -1
            : (a?.MST_PO ?? "") < (b?.MST_PO ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let up: number =
          a?.MST_NM < b?.MST_NM ? -1 : a?.MST_NM > b?.MST_NM ? 1 : 0;
        let down: number =
          a?.MST_NM > b?.MST_NM ? -1 : a?.MST_NM < b?.MST_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 4) {
      copy?.sort((a, b) => {
        let up: number =
          a?.MST_GD < b?.MST_GD ? -1 : a?.MST_GD > b?.MST_GD ? 1 : 0;
        let down: number =
          a?.MST_GD > b?.MST_GD ? -1 : a?.MST_GD < b?.MST_GD ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 5) {
      copy?.sort((a, b) => {
        let up: number =
          (a?.AUTH_TEXT ?? "") < (b?.AUTH_TEXT ?? "")
            ? -1
            : (a?.AUTH_TEXT ?? "") > (b?.AUTH_TEXT ?? "")
            ? 1
            : 0;
        let down: number =
          (a?.AUTH_TEXT ?? "") > (b?.AUTH_TEXT ?? "")
            ? -1
            : (a?.AUTH_TEXT ?? "") < (b?.AUTH_TEXT ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 6) {
      copy?.sort((a, b) => {
        let up =
          (a?.MST_CRT_DT ?? 0) < (b?.MST_CRT_DT ?? 0)
            ? -1
            : (a?.MST_CRT_DT ?? 0) > (b?.MST_CRT_DT ?? 0)
            ? 1
            : 0;
        let down =
          (a?.MST_CRT_DT ?? 0) > (b?.MST_CRT_DT ?? 0)
            ? -1
            : (a?.MST_CRT_DT ?? 0) < (b?.MST_CRT_DT ?? 0)
            ? 1
            : 0;
        return isUp ? up : down;
      });
    }

    return copy;
  }, [masterList, activeFilter]);

  const getPostList = () => {
    if (currentList) return;
    useAxios.get("/master").then(({ data }) => {
      setIsLoading(false);
      setMasterList(data?.current);
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
          count={resultMasterList?.length}
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
            {resultMasterList?.map((item, i) => (
              <Tr key={item?.MST_SQ}>
                <Td>{i + 1}</Td>
                <Td>{item?.MST_NM ?? "-"}</Td>
                <Td>{item?.MST_GRP ?? "-"}</Td>
                <Td>{item?.MST_PO ?? "-"}</Td>
                <Td>
                  {item?.MST_GD === 1
                    ? "남자"
                    : item?.MST_GD == 2
                    ? "여자"
                    : "-"}
                </Td>
                <Td>{item?.MST_NUM ?? "-"}</Td>
                <Td>{item?.MST_ID ?? "-"}</Td>
                <Td>{item?.AUTH_SQ ?? "-"}</Td>
                <Td>{item?.MST_CRT_DT ?? "-"}</Td>
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
