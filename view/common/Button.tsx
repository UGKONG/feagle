import _React from "react";
import styled from "styled-components";

export default function Button(props: any) {
  return <ButtonTag {...props} />;
}

const ButtonTag = styled.button`
  height: 40px;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  outline: 0;
  border: none;
  color: #fff;
  background-color: #8b61dc;
  box-shadow: 0 0 5px #8a69d1 inset;
  cursor: pointer;
  letter-spacing: 1px;
  transition: 0.2s;

  &:hover {
    background-color: #784dd0;
  }
  &:active {
    background-color: #5b30b2;
  }
`;
