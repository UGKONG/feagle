import _React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Logout } from "@mui/icons-material";
import { MenuList, menuList } from "../../string";
import { useAxios } from "../../functions/utils";

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();

  // 메뉴 클릭
  const menuClick = (path: string) => navigate(path);

  // 로그아웃
  const logout = () => {
    useAxios.get("/common/logout").then(() => navigate("/signin"));
  };

  // 메뉴 활성화 여부
  const isActive = (path: string): string => {
    if (location?.pathname !== "/" && path === "/") return "";
    return location?.pathname?.indexOf(path) > -1 ? "active" : "";
  };

  return (
    <Container>
      <MenuListContainer>
        {menuList?.map((item) => (
          <MenuItem
            key={item?.path}
            className={isActive(item?.path)}
            onClick={() => menuClick(item?.path)}
          >
            {item?.name}
          </MenuItem>
        ))}
      </MenuListContainer>
      <SignoutBtn onClick={logout} />
    </Container>
  );
}

const Container = styled.aside`
  width: 140px;
  height: calc(100% - 70px);
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  margin-right: 20px;
`;
const MenuListContainer = styled.ul`
  width: 100%;
`;
const MenuItem = styled.li`
  transition: 0.1s;
  padding: 10px 0;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #888888;
  cursor: pointer;

  &:hover {
    color: #8b6ad3;
  }
  &.active {
    font-weight: 700;
    color: #6d3fcf;
  }
`;
const SignoutBtn = styled(Logout)`
  color: #888888;
  cursor: pointer;
  &:hover {
    color: #666666;
  }
`;
