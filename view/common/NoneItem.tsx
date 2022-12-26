import _React, { useMemo } from "react";
import styled from "styled-components";

type Props = { colSpan: number | Array<string> };
export default function NoneItem({ colSpan }: Props) {
  const colSpanCount = useMemo<number>(() => {
    if (typeof colSpan === "number") return colSpan;
    return colSpan?.length;
  }, [colSpan]);

  return (
    <Tr>
      <Td colSpan={colSpanCount}>리스트가 없습니다.</Td>
    </Tr>
  );
}

const Tr = styled.tr``;
const Td = styled.td`
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 14px;
`;
