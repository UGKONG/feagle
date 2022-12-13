import _React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../../functions/utils";
import { Device, History } from "../../../types";
import _Container from "../../common/Container";
import { HeaderList, Props } from "./index.type";

const headerList: HeaderList = ["No", "내용", "일시"];

export default function History({ isHeader = true, currentList }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(currentList ? false : true);
  const [deviceList, setDeviceList] = useState<History[]>(currentList ?? []);

  const getShopList = () => {
    if (currentList) return;
    useAxios.get("/device").then(({ data }) => {
      setIsLoading(false);
      setDeviceList(data?.current);
    });
  };

  useEffect(getShopList, []);

  return (
    <Container isContents={currentList ? true : false} isLoading={isLoading}>
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
              <Tr key={i}>
                <Td>{i + 1}</Td>
                <Td>{item?.UDD_TXT ?? "-"}</Td>
                <Td>{item?.UDD_CRT_DT ?? "-"}</Td>
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
