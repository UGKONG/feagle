import _React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Master, SelectChangeEvent } from "../../../types";
import Button from "../../common/Button";
import _Container from "../../common/Container";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";
import _Select from "../../common/Select";
import { useDispatch } from "react-redux";
import NoneItem from "../../common/NoneItem";

const filterList: FilterList = [
  { id: 1, name: "이름" },
  { id: 2, name: "부서" },
  { id: 3, name: "직급" },
  { id: 4, name: "성별" },
  { id: 5, name: "신청일" },
];
const headerList: HeaderList = [
  "No",
  "이름",
  "부서",
  "직급",
  "성별",
  "연락처",
  "신청일",
  "요청처리",
];

export default function JoinList({
  isHeader = true,
  setJoinListView,
  authList,
}: Props) {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<Master[]>([]);
  const [isChk, setIsChk] = useState<null | "yes" | "no">(null);

  const resultMasterList = useMemo<Master[]>(() => {
    let copy = [...list];
    let json = JSON.stringify;
    let q = activeFilter?.filter?.replace(/ /g, "");
    let sort = activeFilter?.sort;
    let isUp = activeFilter?.dir === "ASC";

    // 검색어
    if (q) {
      copy = copy?.filter((x) => json(x)?.replace(/ /g, "")?.indexOf(q) > -1);
    }

    // 솔팅 타입
    // (1 - 이름, 2 - 부서, 3 - 직급, 4 - 성별, 5 - 신청일)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up: number =
          a?.MST_NM < b?.MST_NM ? -1 : a?.MST_NM > b?.MST_NM ? 1 : 0;
        let down: number =
          a?.MST_NM > b?.MST_NM ? -1 : a?.MST_NM < b?.MST_NM ? 1 : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up: number =
          (a?.MST_GRP ?? "") < (b?.MST_GRP ?? "")
            ? -1
            : (a?.MST_GRP ?? "") > (b?.MST_GRP ?? "")
            ? 1
            : 0;
        let down: number =
          (a?.MST_GRP ?? "") > (b?.MST_GRP ?? "")
            ? -1
            : (a?.MST_GRP ?? "") < (b?.MST_GRP ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let up: number =
          (a?.MST_PO ?? "") < (b?.MST_PO ?? "")
            ? -1
            : (a?.MST_PO ?? "") > (b?.MST_PO ?? "")
            ? 1
            : 0;
        let down: number =
          (a?.MST_PO ?? "") > (b?.MST_PO ?? "")
            ? -1
            : (a?.MST_PO ?? "") < (b?.MST_PO ?? "")
            ? 1
            : 0;
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
          (a?.MST_CRT_DT ?? 0) < (b?.MST_CRT_DT ?? 0)
            ? -1
            : (a?.MST_CRT_DT ?? 0) > (b?.MST_CRT_DT ?? 0)
            ? 1
            : 0;
        let down: number =
          (a?.MST_CRT_DT ?? 0) > (b?.MST_CRT_DT ?? 0)
            ? -1
            : (a?.MST_CRT_DT ?? 0) < (b?.MST_CRT_DT ?? 0)
            ? 1
            : 0;
        return isUp ? up : down;
      });
    }

    return copy;
  }, [list, activeFilter]);

  // useAlert
  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  // 요청자 리스트 조회
  const getList = () => {
    useAxios.get("/master/join").then(({ data }) => {
      setIsLoading(false);
      setList(data?.current);
    });
  };

  // 요청자 처리
  const join = (MST_SQ: number, AUTH_SQ: number, IS_OK: 0 | 1) => {
    let form = { AUTH_SQ, IS_OK };
    let txt = IS_OK === 1 ? "수락" : "거절";

    useAxios.put("/master/join/" + MST_SQ, form).then(({ data }) => {
      if (!data?.result) {
        return useAlert("error", txt + "에 실패하였습니다.");
      }
      useAlert("success", txt + "되었습니다.");
      getList();
    });
  };

  useEffect(getList, []);

  return (
    <Container isContents={false} isLoading={isLoading}>
      {isHeader && (
        <TableHeaderContainer
          list={filterList}
          active={activeFilter}
          setActive={setActiveFilter}
          count={resultMasterList?.length}
          buttons={[
            {
              id: 1,
              name: "요청자 닫기",
              color: "gray",
              onClick: () => setJoinListView(false),
            },
          ]}
        />
      )}
      <List height={null}>
        <Table>
          <THeader>
            <tr>
              {headerList?.map((item) => (
                <Column key={item}>{item}</Column>
              ))}
            </tr>
          </THeader>
          <TBody>
            {!resultMasterList?.length ? (
              <NoneItem colSpan={headerList} />
            ) : (
              resultMasterList?.map((item, i) => (
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
                  <Td>{item?.MST_CRT_DT ?? "-"}</Td>
                  <Td>
                    {!isChk ? (
                      <>
                        <YesBtn onClick={() => setIsChk("yes")} />
                        <NoBtn onClick={() => setIsChk("no")} />
                      </>
                    ) : (
                      <>
                        {isChk === "yes" ? (
                          <Select
                            defaultValue={item?.AUTH_SQ}
                            onChange={(e: SelectChangeEvent) =>
                              join(
                                item?.MST_SQ as number,
                                Number(e?.target?.value),
                                1
                              )
                            }
                          >
                            <option value="">권한을 선택해주세요.</option>
                            {authList
                              ?.filter((x) => x?.COMM_CODE !== 5)
                              ?.map((x) => (
                                <option key={x?.COMM_CODE} value={x?.COMM_CODE}>
                                  {x?.COMM_NM}
                                </option>
                              ))}
                          </Select>
                        ) : (
                          <>
                            <span style={{ marginRight: 10 }}>
                              거절하시겠습니까?
                            </span>
                            <NoBtn
                              onClick={() => join(item?.MST_SQ as number, 0, 0)}
                            />
                          </>
                        )}
                        <CancelBtn onClick={() => setIsChk(null)} />
                      </>
                    )}
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
const Btn = styled(Button)`
  height: 30px;
  border-radius: 100px;
  margin-right: 5px;
  border: none;
  box-shadow: none;
`;
const YesBtn = styled(Btn)`
  &::before {
    content: "수락";
  }
`;
const NoBtn = styled(Btn)`
  background-color: #fa6d6d;

  &:hover {
    background-color: #ea4d4d;
  }
  &:active {
    background-color: #e72d2d;
  }

  &::before {
    content: "거절";
  }
`;
const CancelBtn = styled(Btn)`
  background-color: #999;

  &:hover {
    background-color: #888;
  }
  &:active {
    background-color: #777;
  }

  &::before {
    content: "취소";
  }
`;
const Select = styled(_Select)`
  max-width: 150px;
  height: 34px;
  border-radius: 100px;
  margin-right: 10px;
`;
