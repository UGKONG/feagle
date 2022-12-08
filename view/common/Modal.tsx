import React, { useCallback } from "react";
import styled from "styled-components";
import Button from "./Button";

interface Props {
  title: string;
  buttons?: Array<{ id: number; name: string; onClick: () => void }>;
  children?: JSX.Element;
  size?: number;
  bgColor?: string;
  close: () => void;
}
export default function Modal({
  title = "MODAL TITLE",
  buttons = [],
  children = <></>,
  size = 0,
  bgColor = "#fff",
  close,
}: Props) {
  return (
    <>
      <Bg onClick={close} />
      <Container size={size} bgColor={bgColor}>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Padding>{children}</Padding>
        <ButtonContainer>
          {buttons?.map((item) => (
            <Btn key={item?.id} onClick={item?.onClick}>
              {item?.name}
            </Btn>
          ))}
          <Btn type="close" onClick={close}>
            닫 기
          </Btn>
        </ButtonContainer>
      </Container>
    </>
  );
}

const Bg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000030;
`;
const Container = styled.section<{ size: number; bgColor: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
  max-width: 80vw;
  width: ${(x) => (x?.size ? x?.size + "px" : "unset")};
  min-height: 200px;
  max-height: 80vh;
  background-color: ${(x) => x?.bgColor};
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 1px 2px 4px #00000040;
  display: flex;
  flex-direction: column;
`;
const Header = styled.section`
  width: 100%;
  height: 50px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Title = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #774bd8;
  letter-spacing: 2px;
`;
const Padding = styled.div`
  flex: 1;
  margin: 0 12px;
  overflow: auto;
`;
const ButtonContainer = styled.article`
  margin: 7px 12px 12px;
`;
const Btn = styled(Button)`
  margin-top: 5px;
  width: 100%;
  height: 36px;
  box-shadow: none;
  background-color: ${(x) => (x?.type === "close" ? "#aaa" : "#8b61dc")};
  &:hover {
    background-color: ${(x) => (x?.type === "close" ? "#999" : "#784dd0")};
  }
  &:active {
    background-color: ${(x) => (x?.type === "close" ? "#777" : "#5b30b2")};
  }
`;
