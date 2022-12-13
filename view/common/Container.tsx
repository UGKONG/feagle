import _React from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

export default function Container(props: any) {
  return (
    <Contents {...props}>
      {props?.children ?? null}
      {props?.isLoading ? (
        <Loading>
          <CircularProgress />
        </Loading>
      ) : null}
    </Contents>
  );
}

const Contents = styled.section<{ isContents?: boolean }>`
  overflow: hidden;
  flex: 1;
  align-self: stretch;
  background-color: ${(x) => (x?.isContents ? "transparent" : "#e7e7f1")};
  border-radius: 10px;
  position: relative;
  max-height: calc(100% - 60px);
  border: ${(x) => (x?.isContents ? "none" : "1px solid #ddd")};
  padding: ${(x) => (x?.isContents ? 0 : 10)}px;
  & thead {
    background-color: ${(x) =>
      x?.isContents ? "transparent" : "#e7e7f1"} !important;
  }
`;
const Loading = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background-color: #00000010;
`;
