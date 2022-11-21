import _React, { useEffect } from "react";
import Routes from "./common/Routes";
import bgImg from "./assets/images/bg.png";
import styled from "styled-components";

export default function App() {
  return (
    <Background>
      <Container>
        <Routes />
      </Container>
    </Background>
  );
}

const Background = styled.div`
  flex: 1;
  height: 100vh;
  background: url("${bgImg}") no-repeat center;
  background-size: cover;
  padding: 20px;
  display: flex;
`;
const Container = styled.div`
  background-color: #ffffffdd;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #dddddd;
  flex: 1;
  display: flex;
`;
