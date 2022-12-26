import _React from "react";
import styled from "styled-components";
import { History } from "../../../types";
import _Container from "../../common/Container";
import NoneItem from "../../common/NoneItem";
import { HeaderList, Props } from "./index.type";

const headerList: HeaderList = ["No", "내용", "일시"];

export default function History({ currentList }: Props) {
  return (
    <Container isContents={true}>
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
            {!currentList?.length ? (
              <NoneItem colSpan={headerList} />
            ) : (
              currentList?.map((item, i) => (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>{item?.UDD_TXT ?? "-"}</Td>
                  <Td style={{ whiteSpace: "nowrap" }}>
                    {item?.UDD_CRT_DT ?? "-"}
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
const List = styled.section`
  width: 100%;
  position: relative;
  overflow: auto;
  height: unset;
  margin-bottom: 50px;
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
