import _React from "react";
import styled from "styled-components";

interface Props {
  color?: string;
  isActive?: boolean;
}
export default function Dot({ color, isActive = false }: Props) {
  return <Container color={color} className={isActive ? "active" : ""} />;
}

const Container = styled.div<Props>`
  min-width: 8px;
  max-width: 8px;
  min-height: 8px;
  max-height: 8px;
  border-radius: 100px;
  box-shadow: 0 0 2px #00000020;
  background-color: #eda633;

  &.active {
    background-color: ${(x) => x?.color ?? "#0ead1c"};
  }
`;
