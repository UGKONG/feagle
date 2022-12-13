import _React from "react";
import styled from "styled-components";
import _Container from "../../common/Container";
import { HiCode } from "react-icons/hi";

export default function DevPage() {
  return (
    <Container>
      <Icon />
      <span>개발중</span>
    </Container>
  );
}

const Icon = styled(HiCode)`
  font-size: 200px;
`;
const Container = styled(_Container)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  font-weight: 700;
  color: #ccc;
  letter-spacing: 10px;
  text-indent: 10px;
  padding-bottom: 100px;
  flex-direction: column;
`;
