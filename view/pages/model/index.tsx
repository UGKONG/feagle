import _React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { AlertType, DeviceModel, InputChangeEvent } from "../../../types";
import _Container from "../../common/Container";
import _Input from "../../common/Input";
import Modal from "../../common/Modal";
import TableHeaderContainer from "../../common/TableHeaderContainer";
import { Active, FilterList, HeaderList, Props } from "./index.type";

const filterList: FilterList = [
  { id: 1, name: "한글명" },
  { id: 2, name: "영문명" },
  { id: 3, name: "생성일시" },
];
const headerList: HeaderList = ["No", "한글명", "영문명", "설명", "생성일시"];

export default function Model() {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<Active>({
    sort: 1,
    dir: "ASC",
    filter: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<DeviceModel[]>([]);
  const [isCreateModal, setIsCreateModal] = useState<boolean>(false);
  const [editModelData, setEditModelData] = useState<DeviceModel | null>(null);
  const [deleteModelSq, setDeleteModelSq] = useState<number | null>(null);
  const [value, setValue] = useState<DeviceModel>({
    MDL_NM: "",
    MDL_EN_NM: "",
    MDL_DESC: "",
  });

  const koInputRef = useRef<HTMLInputElement>(null);
  const enInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);

  const useAlert = (type: AlertType, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  const resultDeviceList = useMemo<DeviceModel[]>(() => {
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
    // (1 - 한글명, 2 - 영문명, 3 - 생성일시)
    if (sort === 1) {
      copy?.sort((a, b) => {
        let up: number =
          (a?.MDL_NM ?? "") < (b?.MDL_NM ?? "")
            ? -1
            : (a?.MDL_NM ?? "") > (b?.MDL_NM ?? "")
            ? 1
            : 0;
        let down: number =
          (a?.MDL_NM ?? "") > (b?.MDL_NM ?? "")
            ? -1
            : (a?.MDL_NM ?? "") < (b?.MDL_NM ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 2) {
      copy?.sort((a, b) => {
        let up =
          a?.MDL_EN_NM < b?.MDL_EN_NM
            ? -1
            : a?.MDL_EN_NM > b?.MDL_EN_NM
            ? 1
            : 0;
        let down =
          a?.MDL_EN_NM > b?.MDL_EN_NM
            ? -1
            : a?.MDL_EN_NM < b?.MDL_EN_NM
            ? 1
            : 0;
        return isUp ? up : down;
      });
    } else if (sort === 3) {
      copy?.sort((a, b) => {
        let up: number =
          (a?.MDL_CRT_DT ?? "") < (b?.MDL_CRT_DT ?? "")
            ? -1
            : (a?.MDL_CRT_DT ?? "") > (b?.MDL_CRT_DT ?? "")
            ? 1
            : 0;
        let down: number =
          (a?.MDL_CRT_DT ?? "") > (b?.MDL_CRT_DT ?? "")
            ? -1
            : (a?.MDL_CRT_DT ?? "") < (b?.MDL_CRT_DT ?? "")
            ? 1
            : 0;
        return isUp ? up : down;
      });
    }

    return copy;
  }, [list, activeFilter]);

  const getList = (): void => {
    useAxios.get("/model").then(({ data }) => {
      setIsLoading(false);
      setList(data?.current);
    });
  };

  const modalClose = (): void => {
    setIsCreateModal(false);
    setEditModelData(null);
    setValue({ MDL_NM: "", MDL_EN_NM: "", MDL_DESC: "" });
    getList();
  };

  const createSubmit = (): void => {
    useAxios.post("/model", value).then(({ data }) => {
      if (!data?.result) return useAlert("error", "저장에 실패하였습니다.");

      useAlert("success", "저장되었습니다.");
      modalClose();
    });
  };

  const updateSubmit = (): void => {
    useAxios
      .put("/model/" + editModelData?.MDL_SQ, editModelData)
      .then(({ data }) => {
        if (!data?.result) return useAlert("error", "수정에 실패하였습니다.");

        useAlert("success", "수정되었습니다.");
        modalClose();
      });
  };

  const validate = (): void => {
    if (editModelData) {
      if (!editModelData?.MDL_NM) return koInputRef.current?.focus();
      updateSubmit();
    } else {
      if (!value?.MDL_NM) return koInputRef.current?.focus();
      createSubmit();
    }
  };

  const deleteModel = (): void => {
    useAxios.delete("/model/" + deleteModelSq).then(({ data }) => {
      setDeleteModelSq(null);
      if (!data?.result) {
        return useAlert("error", data?.message ?? "제거에 실패하였습니다.");
      }

      useAlert("success", "제거되었습니다.");
      getList();
    });
  };

  const changeValue = (key: string, val: string): void => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  const changeEditValue = (key: string, val: string): void => {
    setEditModelData((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: val };
    });
  };

  useEffect(getList, []);

  return (
    <>
      <Container isContents={false} isLoading={isLoading}>
        <TableHeaderContainer
          list={filterList}
          active={activeFilter}
          setActive={setActiveFilter}
          count={resultDeviceList?.length}
          buttons={[
            {
              id: 1,
              name: "장비 모델 등록",
              onClick: () => setIsCreateModal(true),
            },
          ]}
        />
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
              {resultDeviceList?.map((item, i) => (
                <Tr key={item?.MDL_SQ} onClick={() => setEditModelData(item)}>
                  <Td>{i + 1}</Td>
                  <Td>{item?.MDL_NM ?? "-"}</Td>
                  <Td>{item?.MDL_EN_NM ?? "-"}</Td>
                  <Td>{item?.MDL_DESC ?? "-"}</Td>
                  <Td>{item?.MDL_CRT_DT ?? "-"}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </List>
      </Container>

      {isCreateModal && (
        <Modal
          title="장비 모델 등록"
          size={400}
          close={() => modalClose()}
          buttons={[{ id: 1, name: "등 록", onClick: () => validate() }]}
        >
          <>
            <Row>
              <RowTitle>한글명</RowTitle>
              <Input
                value={value?.MDL_NM ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeValue("MDL_NM", e?.target?.value)
                }
                childRef={koInputRef}
                placeholder="한글명을 입력해주세요."
              />
            </Row>
            <Row>
              <RowTitle>영문명</RowTitle>
              <Input
                value={value?.MDL_EN_NM ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeValue("MDL_EN_NM", e?.target?.value)
                }
                childRef={enInputRef}
                placeholder="영문명을 입력해주세요. (선택입력)"
              />
            </Row>
            <Row>
              <RowTitle>설명</RowTitle>
              <Input
                value={value?.MDL_DESC ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeValue("MDL_DESC", e?.target?.value)
                }
                childRef={descInputRef}
                placeholder="설명을 입력해주세요. (선택입력)"
              />
            </Row>
          </>
        </Modal>
      )}

      {editModelData ? (
        <Modal
          title="장비 모델 수정"
          size={400}
          close={() => setEditModelData(null)}
          buttons={[
            { id: 1, name: "수 정", onClick: () => validate() },
            {
              id: 2,
              name: "삭제",
              color: "red",
              onClick: () => {
                setDeleteModelSq(editModelData?.MDL_SQ ?? null);
                setEditModelData(null);
              },
            },
          ]}
        >
          <>
            <Row>
              <RowTitle>한글명</RowTitle>
              <Input
                value={editModelData?.MDL_NM ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeEditValue("MDL_NM", e?.target?.value)
                }
                childRef={koInputRef}
                placeholder="한글명을 입력해주세요."
              />
            </Row>
            <Row>
              <RowTitle>영문명</RowTitle>
              <Input
                value={editModelData?.MDL_EN_NM ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeEditValue("MDL_EN_NM", e?.target?.value)
                }
                childRef={enInputRef}
                placeholder="영문명을 입력해주세요. (선택입력)"
              />
            </Row>
            <Row>
              <RowTitle>설명</RowTitle>
              <Input
                value={editModelData?.MDL_DESC ?? ""}
                onChange={(e: InputChangeEvent) =>
                  changeEditValue("MDL_DESC", e?.target?.value)
                }
                childRef={descInputRef}
                placeholder="설명을 입력해주세요. (선택입력)"
              />
            </Row>
          </>
        </Modal>
      ) : null}

      {deleteModelSq ? (
        <Modal
          title="장비 모델 삭제"
          size={400}
          close={() => setDeleteModelSq(null)}
          buttons={[
            {
              id: 1,
              name: "삭 제",
              color: "red",
              onClick: () => deleteModel(),
            },
          ]}
        >
          <DeleteDesc>
            <span style={{ fontWeight: 500 }}>
              해당 장비 모델을 제거하시겠습니까?
            </span>
            <br />
            <br />
            <small>
              ※ 해당 모델에 속한 장비가 존재하면 삭제할 수 없습니다.
            </small>
          </DeleteDesc>
        </Modal>
      ) : null}
    </>
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
const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const RowTitle = styled.p`
  width: 100px;
  font-size: 15px;
  color: #444444;
`;
const Input = styled(_Input)`
  height: 34px;
`;
const DeleteDesc = styled.span`
  font-size: 15px;
  color: #f00;
`;
