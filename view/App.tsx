import _React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import Routes from "./common/Routes";
import bgImg from "./assets/images/bg.png";
import { useDispatch } from "react-redux";
import { useAxios } from "../functions/utils";
import { Master } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "./common/Alert";
import Menu from "./common/Menu";
import Header from "./common/Header";
import { MenuList, menuList } from "../string";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const activePage = useMemo<MenuList | null>(() => {
    const path = location.pathname;
    let pathString = path?.split("/")[1];
    let find = menuList?.find((x) => x.path?.replace(/\//g, "") === pathString);
    return find ?? null;
  }, [location.pathname]);

  const isMainPage = useMemo<boolean>(() => {
    let split = location.pathname?.split("/");
    console.log(split);
    return split?.length <= 2 || split[split?.length - 1] === "";
  }, [location?.pathname]);

  // 커스텀 타이틀 초기화
  const customTitleReset = (): void => {
    dispatch({ type: "customTitle", payload: "" });
  };

  // 세션 체크
  const sessionCheck = (): void => {
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

  useEffect(customTitleReset, [location]);

  return (
    <>
      <Background>
        <Container>
          <Wrap>
            {activePage && (
              <>
                <Header activePage={activePage} isMainPage={isMainPage} />
                {isMainPage && <Menu />}
              </>
            )}
            <Routes />
          </Wrap>
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
  position: relative;
`;
const Wrap = styled.main`
  display: flex;
  align-items: center;
  align-content: flex-start;
  justify-content: center;
  flex: 1;
  flex-wrap: wrap;
`;
