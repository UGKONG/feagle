import _React, { useMemo } from "react";
import styled from "styled-components";
import { MenuList } from "../../string";
import { FaBell, FaUserCircle } from "react-icons/fa";

interface Props {
  activePage: MenuList | null;
}
export default function Header({ activePage }: Props) {
  const pageName = useMemo<string>(() => {
    if (!activePage) return "";
    return activePage?.name;
  }, [activePage]);

  return (
    <Container>
      <Side>
        <Logo />
        <Title>{pageName}</Title>
      </Side>
      <Side>
        <NoticeIcon />
        <UserIcon />
      </Side>
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  min-height: 50px;
  max-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const Side = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
`;
const Logo = styled.h1.attrs(() => ({}))`
  width: 200px;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 85% auto;
  background-position: left center;
  background-image: url(${require("../assets/images/logo.png").default});
`;
const Title = styled.h2`
  font-size: 20px;
`;
const iconStyle = `
  border-radius: 50%;
  color: #aaa;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: #888;
  }
`;
const NoticeIcon = styled(FaBell)`
  width: 30px;
  height: 30px;
  ${iconStyle}
`;
const UserIcon = styled(FaUserCircle)`
  width: 36px;
  height: 36px;
  ${iconStyle}
`;
