import _React, { memo, useMemo } from "react";
import styled from "styled-components";
import { MenuList } from "../../string";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Props {
  activePage: MenuList | string | null;
  iconHide?: boolean;
  logoClick?: string;
}
function Header({ activePage, iconHide, logoClick }: Props) {
  const navigate = useNavigate();

  const name = useMemo(() => {
    if (typeof activePage === "string") return activePage;
    return activePage?.name;
  }, [activePage]);

  const onClick = () => {
    if (!logoClick) return;
    navigate(logoClick);
  };

  return (
    <Container>
      <Side>
        <Logo onClick={onClick} />
        <Title>{name ?? "-"}</Title>
      </Side>
      {!iconHide && (
        <Side>
          <NoticeIcon />
          <UserIcon />
        </Side>
      )}
    </Container>
  );
}

export default memo(Header);

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
  cursor: pointer;
`;
const Title = styled.h2`
  font-size: 20px;
`;
const iconStyle = `
  border-radius: 50%;
  color: #aaa;
  cursor: pointer;
  margin-left: 20px;

  &:hover {
    color: #888;
  }
`;
const NoticeIcon = styled(FaBell)`
  width: 26px;
  height: 26px;
  ${iconStyle}
`;
const UserIcon = styled(FaUserCircle)`
  width: 36px;
  height: 36px;
  ${iconStyle}
`;
