import { CircularProgress } from "@mui/material";
import _React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { MenuList, menuList } from "../../string";
import Header from "./Header";
import Menu from "./Menu";

export default function Container(props: any) {
  const location = useLocation();
  const path = location.pathname;

  const activePage = useMemo<MenuList | null>(() => {
    let pathString = path?.replace(/\//g, "");
    let find = menuList?.find((x) => x.path?.replace(/\//g, "") === pathString);
    return find ?? null;
  }, [path]);

  return (
    <ContainerTag {...props}>
      <Header activePage={activePage} />
      <Menu activePage={activePage} />
      <Contents>
        {props?.children ?? null}
        {props?.isLoading ? (
          <Loading>
            <CircularProgress />
          </Loading>
        ) : null}
      </Contents>
    </ContainerTag>
  );
}
const ContainerTag = styled.main`
  display: flex;
  align-items: center;
  align-content: flex-start;
  justify-content: center;
  flex: 1;
  flex-wrap: wrap;
`;
const Contents = styled.section`
  overflow: hidden;
  flex: 1;
  align-self: stretch;
  background-color: #e7e7f1;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  position: relative;
  max-height: calc(100% - 60px);
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
