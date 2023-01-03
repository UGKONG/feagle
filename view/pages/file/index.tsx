import _React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useAxios, useIsNumber } from "../../../functions/utils";
import Container from "../../common/Container";
import { HeaderList, Props } from "./index.type";
import { saveAs } from "file-saver";

const headerList: HeaderList = ["No", "파일 이름", "파일 유형", "파일 사이즈"];

export default function FileList({ currentList }: Props) {
  const dispatch = useDispatch();

  const useAlert = (type: "success" | "error", text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  const fileDownload = (FILE_SQ: number, FILE_NM: string): void => {
    if (!FILE_SQ || !useIsNumber(FILE_SQ)) {
      return useAlert("error", "파일이 존재하지 않습니다.");
    }

    useAxios.get("/file/" + FILE_SQ).then(({ data }) => {
      if (data?.result === false) {
        return useAlert("error", "파일이 존재하지 않습니다.");
      }

      useAlert("success", "파일을 다운받습니다.");
      saveAs("/api/file/" + FILE_SQ, FILE_NM);
    });
  };

  return (
    <Container isContents={true}>
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
            {currentList?.map((item, i) => (
              <Tr
                key={item?.FILE_SQ}
                onClick={() =>
                  fileDownload(item?.FILE_SQ as number, item?.FILE_NM)
                }
              >
                <Td>{i + 1}</Td>
                <Td>{item?.FILE_NM ?? "-"}</Td>
                <Td>{item?.FILE_EXT ?? "-"}</Td>
                <Td>{item?.FILE_SZ ?? "-"}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </List>
    </Container>
  );
}

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
