import _React from "react";
import styled from "styled-components";

export default function Input(props: any) {
  return (
    <InputTag autoComplete="new-password" ref={props?.childRef} {...props} />
  );
}

const InputTag = styled.input`
  width: 100%;
  min-width: 100px;
  height: 44px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 12px;
  outline: 0;
  transition: 0.1s;

  &:hover {
    border: 1px solid #6d3fcf77;
  }
  &:focus {
    border: 2px solid #6d3fcf;
  }
`;
