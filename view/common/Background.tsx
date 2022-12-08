import React from "react";
import styled from "styled-components";

type Props = { close: () => void };
export default function Background({ close }: Props) {
  return <Container onClick={close} />;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #00000030;
`;
