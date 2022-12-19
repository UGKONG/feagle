import _React from "react";
import styled from "styled-components";

export default function Textarea(props: any) {
  return (
    <TextareaTag autoComplete="new-password" ref={props?.childRef} {...props} />
  );
}

const TextareaTag = styled.textarea`
  width: 100%;
  min-width: 100px;
  height: 200px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 10px;
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
