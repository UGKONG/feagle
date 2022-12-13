import _React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { MenuList } from "../../string";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Store } from "../../functions/store";
import { FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useAxios } from "../../functions/utils";
import NoticeView from "./NoticeView";

interface Props {
  activePage: MenuList | string | null;
  isMainPage: boolean;
  iconHide?: boolean;
  logoClick?: string;
}
function Header({ activePage, isMainPage, iconHide, logoClick }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const customName = useSelector((x: Store) => x?.customTitle);
  const noticeList = useSelector((x: Store) => x?.noticeList);
  const [isNoticeView, setIsNoticeView] = useState<boolean>(false);

  const getNoticeList = (): void => {
    useAxios.get("/gas").then(({ data }) => {
      dispatch({
        type: "noticeList",
        payload: data?.result ? data?.current : [],
      });
    });
  };

  const name = useMemo<string>(() => {
    if (typeof activePage === "string") return activePage;
    return activePage?.name ?? "-";
  }, [activePage]);

  const onClick = (): void => {
    if (!logoClick) return;
    navigate(logoClick);
  };

  const back = (): void => navigate(-1);

  useEffect(() => {
    setIsNoticeView(false);
    getNoticeList();
  }, [location]);

  return (
    <>
      <Container>
        <Side>
          <Logo onClick={onClick} />
          {!isMainPage && (
            <BackBtn onClick={back}>
              <BackIcon />
              뒤로가기
            </BackBtn>
          )}
          <Title>{customName || name}</Title>
        </Side>
        {!iconHide && (
          <Side>
            <NoticeIcon
              color={isNoticeView ? "#6d3fcf" : "#aaaaaa"}
              onClick={() => setIsNoticeView((prev) => !prev)}
            />
            <UserIcon />
          </Side>
        )}
      </Container>

      {isNoticeView && (
        <NoticeView list={noticeList} getNoticeList={getNoticeList} />
      )}
    </>
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
  width: 160px;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 85% auto;
  background-position: left center;
  background-image: url(${require("../assets/images/logo.png").default});
  cursor: pointer;
`;
const Title = styled.h2`
  font-size: 20px;
  padding-bottom: 5px;
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
const BackIcon = styled(FiArrowLeft)`
  margin-right: 3px;
`;
const BackBtn = styled.button`
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #aaa;
  padding-bottom: 5px;
  margin-right: 10px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #555555;
  }
`;
