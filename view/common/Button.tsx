import _React from "react";
import styled from "styled-components";

export default function Button(props: any) {
  return <ButtonTag {...props} />;
}

const ButtonTag = styled.button`
  height: 40px;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 13px;
  outline: 0;
  border: none;
  color: #fff;
  background-color: #8b61dc;
  box-shadow: 0 0 5px #8a69d1 inset;
  cursor: pointer;
  letter-spacing: 1px;
  transition: 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #784dd0;
  }
  &:active {
    background-color: #5b30b2;
  }
  &:disabled {
    background-color: #888;
    color: #ccc;
    border: 1px solid #888;
    box-shadow: none;
    cursor: default;
  }
`;
