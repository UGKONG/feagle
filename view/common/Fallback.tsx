import _React from "react";
import styled from "styled-components";

export default function Fallback() {
  return <Container>로딩중..</Container>;
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999999;
`;
