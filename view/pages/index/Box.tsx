import _React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BoxProps } from "./index.type";

export default function Box({ id, name, setDeps, type }: BoxProps) {
  const navigate = useNavigate();

  const boxClick = (): void => {
    if (type === "address") {
      setDeps((prev) => [...prev, name]);
    } else {
      if (!id) return;
      navigate("/shop/" + id);
    }
  };

  return (
    <>
      <Container onClick={boxClick}>
        <Title>{name}</Title>
        {type === "address" ? (
          <Contents>
            <Count>센터: {100}개</Count>
            <Count>장비: {100}대</Count>
            <Count>
              누적사용: {100}회/{100}h
            </Count>
          </Contents>
        ) : (
          <Contents>
            <Count>장비: {100}대</Count>
            <Count>누적횟수: {100}회</Count>
            <Count>누적시간: {100}h</Count>
          </Contents>
        )}
      </Container>
    </>
  );
}

const Container = styled.article`
  display: flex;
  flex-direction: column;
  width: calc(25% - 8px);
  min-height: 100px;
  padding: 10px;
  border-radius: 6px;
  background-color: #8a65da;
  margin-bottom: 10px;
  transition: 0.3s;
  margin-right: 10px;
  cursor: pointer;

  &:nth-of-type(4n) {
    margin-right: 0;
  }

  &:hover {
    background-color: #7a53d0;
  }

  @media screen and (max-width: 2100px) {
    width: calc(33.33% - 7px);

    &:nth-of-type(4n) {
      margin-right: 10px;
    }
    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1600px) {
    width: calc(50% - 5px);

    &:nth-of-type(3n) {
      margin-right: 10px;
    }
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1100px) {
    width: 100%;

    &:nth-of-type(2n) {
      margin-right: 10px;
    }
    &:nth-of-type(1n) {
      margin-right: 0;
    }
  }
`;
const Title = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 10px;
`;
const Contents = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const Count = styled.span`
  font-size: 17px;
  letter-spacing: 1px;
  color: #fff;
`;
