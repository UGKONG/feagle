import _React from "react";
import styled from "styled-components";

export default function SignupModal() {
  return <Container></Container>;
}

const Container = styled.article`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
  min-height: 400px;
  background-color: #fff;
`;
