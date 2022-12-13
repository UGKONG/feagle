import _React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAxios } from "../../functions/utils";
import { GasReq } from "../../types";
import _Button from "./Button";

interface Props {
  list: Array<GasReq>;
  getNoticeList: () => void;
}
export default function NoticeView({ list, getNoticeList }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useAlert
  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  const goShopDetail = (id: number): void => {
    navigate("/shop/" + id);
  };

  const requestCheck = (id: number): void => {
    useAxios.put("/gas/" + id).then(({ data }) => {
      if (!data?.result) {
        return useAlert("error", "신청 확인에 실패하였습니다.");
      }
      useAlert("success", "확인되었습니다.");
      getNoticeList();
    });
  };

  return (
    <Container>
      <Title>가스 신청 피부샵</Title>
      <List>
        {list?.map((item) => (
          <Item key={item?.GR_SQ}>
            <Text>{item?.SHOP_NM}에서 가스를 신청하였습니다.</Text>
            <Button onClick={() => goShopDetail(item?.SHOP_SQ)}>
              피부샵 상세보기
            </Button>
            {item?.IS_CHK === 0 ? (
              <Button onClick={() => requestCheck(item?.GR_SQ)}>
                신청 확인
              </Button>
            ) : (
              <ChkSuccess>확인됨</ChkSuccess>
            )}
          </Item>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.section`
  position: fixed;
  top: 90px;
  right: 30px;
  box-shadow: -1px 2px 4px #00000070;
  width: 270px;
  min-height: 40vh;
  max-height: 70vh;
  background-color: #fff;
  z-index: 9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;
const Title = styled.p`
  margin-bottom: 15px;
  color: #6d3fcf;
  font-size: 14px;
  font-weight: 500;
`;
const List = styled.ul`
  flex: 1;
  overflow: auto;
`;
const Item = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  flex-direction: row-reverse;
  background-color: #ab8cee;
  align-items: flex-end;
  flex-wrap: wrap;
  border-radius: 6px;
`;
const Text = styled.p`
  min-width: 100%;
  flex: 1;
  color: #fff;
  font-size: 12px;
  margin-bottom: 15px;
`;
const Button = styled(_Button)`
  font-size: 10px;
  margin-left: 6px;
  height: 28px;
  padding-bottom: 2px;
`;
const ChkSuccess = styled.span`
  font-size: 12px;
  margin-left: 6px;
  display: flex;
  height: 28px;
  align-items: center;
  justify-content: center;
  padding: 0 9px 1px;
  color: #fff;
  letter-spacing: 1px;
`;
