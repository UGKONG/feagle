import _React, { useEffect } from "react";
import styled from "styled-components";
import Routes from "./common/Routes";
import bgImg from "./assets/images/bg.png";
import { useDispatch } from "react-redux";
import { useAxios } from "../functions/utils";
import { Master } from "../types";
import { useNavigate } from "react-router-dom";
import Alert from "./common/Alert";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 세션 체크
  const sessionCheck = () => {
    useAxios
      .get("/common/session")
      .then(({ data }) => {
        const master: Master = data || null;
        dispatch({ type: "master", payload: master });
        if (!master) navigate("/signin");
      })
      .catch(() => {
        navigate("/signin");
      });
  };

  // useEffect(sessionCheck, []);

  return (
    <>
      <Background>
        <Container>
          <Routes />
        </Container>
      </Background>
      <Alert />
    </>
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
  background-color: #ffffffee;
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #dddddd;
  flex: 1;
  display: flex;
`;
