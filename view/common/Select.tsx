import React from "react";
import styled from "styled-components";

export default function Select(props: any) {
  return (
    <SelectTag ref={props?.childRef} {...props}>
      {props?.children}
    </SelectTag>
  );
}

const SelectTag = styled.select`
  width: 100%;
  min-width: 100px;
  height: 44px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 12px;
  position: relative;
  color: #999999;

  &:hover {
    border: 1px solid #6d3fcf77;
  }
  &:focus {
    color: #333333;
    border: 2px solid #6d3fcf;
  }
`;
