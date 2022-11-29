import _React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Logout } from "@mui/icons-material";
import { MenuList, menuList } from "../../string";
import { useAxios } from "../../functions/utils";

interface Props {
  activePage: MenuList | null;
}
export default function Menu({ activePage }: Props) {
  const navigate = useNavigate();

  const menuClick = (path: string) => navigate(path);

  const logout = () => {
    useAxios.get("/common/logout");
    navigate("/signin");
  };

  const makeClassName = (id: number) => {
    return id === activePage?.id ? "active" : "";
  };

  return (
    <Container>
      <MenuListContainer>
        {menuList?.map((item) => (
          <MenuItem
            key={item?.path}
            className={makeClassName(item?.id)}
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
    font-size: 16px;
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
