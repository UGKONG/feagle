import _React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios, useIsNumber } from "../../../functions/utils";
import { File, Post } from "../../../types";
import _Container from "../../common/Container";
import { useSelector } from "react-redux";
import { Store } from "../../../functions/store";
import Button from "../../common/Button";
import FileList from "../file";

export default function BoardDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUser = useSelector((x: Store) => x?.master);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [boardData, setBoardData] = useState<null | Post>(null);

  // 게시글 시퀀스
  const POST_SQ = useMemo<number>(() => {
    return Number(params?.id);
  }, [params]);

  const MDL_NM = useMemo<string>(() => {
    if (!boardData?.MDL_EN_NM) return boardData?.MDL_NM as string;
    let result = (boardData?.MDL_NM as string) + `(${boardData?.MDL_EN_NM})`;
    return result;
  }, [boardData]);

  // 빌드일
  const BUILD_DT = useMemo<string>(() => {
    if (!boardData?.BUILD_DT) return "";
    return boardData?.BUILD_DT?.split(" ")[0];
  }, [boardData]);

  // 나의 게시글 여부
  const isMyPost = useMemo<boolean>(() => {
    return loginUser?.MST_SQ === boardData?.MST_SQ;
  }, [boardData, loginUser]);

  // 데이터 조회
  const getData = (): void => {
    if (!POST_SQ || !useIsNumber(POST_SQ)) return navigate(-1);
    dispatch({ type: "customTitle", payload: "게시글 상세보기" });
    useAxios.get("/board/" + POST_SQ).then(({ data }) => {
      setIsLoading(false);
      if (!data?.result) {
        dispatch({
          type: "alert",
          payload: { type: "error", text: "게시글 정보가 없습니다." },
        });
        return navigate(-1);
      }

      setBoardData(data?.current);
    });
  };

  useEffect(getData, [POST_SQ]);

  return (
    <Container isLoading={isLoading}>
      {isMyPost && (
        <Header>
          <EditBtn />
          <DelBtn />
        </Header>
      )}
      <Title>제목: {boardData?.POST_TTL ?? "-"}</Title>
      <Row style={{ fontSize: 16, marginBottom: 20 }}>
        <RowTitle>카테고리 :</RowTitle>
        {boardData?.POST_TP_NM ?? "-"}
      </Row>
      <Row>
        <RowTitle>적용모델 :</RowTitle>
        <Desc title={boardData?.MDL_DESC ?? "-"}>{MDL_NM ?? "-"}</Desc>
      </Row>
      <Row>
        <RowTitle>빌드정보 :</RowTitle>
        {boardData?.BUILD_VN} (빌드일: {BUILD_DT})
      </Row>
      <Row>
        <RowTitle>작성일시 :</RowTitle>
        {boardData?.POST_CRT_DT ?? "-"}
      </Row>
      <Row>
        <RowTitle>작성자명 :</RowTitle>
        {boardData?.MST_NM ?? "-"}
      </Row>
      <Row
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 30,
          minHeight: 250,
        }}
      >
        <RowTitle style={{ marginBottom: 6 }}>내용</RowTitle>
        <span style={{ color: "#444", lineHeight: "26px" }}>
          {boardData?.POST_CN ?? "-"}
        </span>
      </Row>
      {(boardData?.FILE_LIST as File[])?.length > 0 && (
        <Row
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: 50,
          }}
        >
          <RowTitle style={{ marginBottom: 6 }}>첨부파일</RowTitle>
          <FileList currentList={boardData?.FILE_LIST as File[]} />
        </Row>
      )}
    </Container>
  );
}

const Container = styled(_Container)`
  min-height: calc(100% - 60px);
  overflow: auto;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const HeaderBtn = styled(Button)`
  margin-left: 6px;
  height: 32px;
  border: none;
  box-shadow: none;
`;
const EditBtn = styled(HeaderBtn)`
  &::before {
    content: "수정";
  }
`;
const DelBtn = styled(HeaderBtn)`
  background-color: #ff7979;
  &:hover {
    background-color: #ff5a5a;
  }
  &:active {
    background-color: #fc2424;
  }
  &::before {
    content: "삭제";
  }
`;
const Title = styled.p`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 30px;
  color: #333333;
`;
const Row = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const RowTitle = styled.p`
  width: 70px;
  font-weight: 500;
`;
const Desc = styled.span.attrs((x) => ({
  title: x?.title,
}))`
  cursor: pointer;
`;
