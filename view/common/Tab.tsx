import _React from "react";
import styled from "styled-components";

interface Props {
  height?: number;
  list: Array<{ id: number; name: string }>;
  active: number;
  color?: string;
  onChange: (id: number) => void;
}
export default function Tab({
  height = 32,
  list,
  active,
  color = "#8b61dc",
  onChange,
}: Props) {
  const isActive = (id: number): string => {
    return active === id ? "active" : "";
  };

  return (
    <Container style={{ height }}>
      {list?.map((item) => (
        <Item
          key={item?.id}
          className={isActive(item?.id)}
          color={color}
          onClick={() => onChange(item?.id)}
        >
          {item?.name}
        </Item>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1000px;
  background-color: #fff;
`;
const Item = styled.button<{ color: string }>`
  flex: 1;
  height: 100%;
  border: none;
  transition: 0.2s;
  background-color: transparent;
  border-radius: 1000px;
  color: #aaaaaa;
  padding: 0 16px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: #777777;
  }
  &.active {
    background-color: ${(x) => x?.color};
    color: #ffffff;
  }
`;
