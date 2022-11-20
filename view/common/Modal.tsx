import _React, { useCallback } from "react";
import styled from "styled-components";
import Button from "./Button";

interface Props {
  title: string;
  component: any;
  close: () => void;
}
export default function Modal({ title = "TITLE", component, close }: Props) {
  if (!component) return null;

  const Contents = useCallback((props: any) => component, [component]);

  return (
    <>
      <Bg onClick={close} />
      <Container>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Padding>
          <Contents></Contents>
        </Padding>
        <CloseBtn onClick={close}>닫 기</CloseBtn>
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
const Container = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
  min-height: 200px;
  background-color: #fff;
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
`;
const Title = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #774bd8;
`;
const Padding = styled.div`
  flex: 1;
  margin: 0 12px 12px;
`;
const CloseBtn = styled(Button)`
  margin: 0 12px 12px;
`;
