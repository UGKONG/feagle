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
      <Contents>{props?.children ?? null}</Contents>
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
  flex: 1;
  align-self: stretch;
  background-color: #e7e7f1;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
`;
