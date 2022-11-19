import _React, { useMemo } from "react";
import styled from "styled-components";
import { useNewId } from "../../functions/utils";

export default function Checkbox(props: any) {
  const labelText = useMemo<string>(() => props?.label ?? "", [props]);
  const randomId = useMemo<string>(() => {
    if (props?.id) return props?.id;
    return String(useNewId());
  }, [props]);

  return (
    <Container>
      <CheckboxTag id={randomId} {...props} />
      <CheckboxView htmlFor={randomId} />
      <CheckboxLabel htmlFor={randomId}>{labelText}</CheckboxLabel>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const CheckboxTag = styled.input.attrs(() => ({ type: "checkbox" }))`
  display: none;
  &:checked + label {
    border: 1px solid #6d3fcf;
    & + label {
      color: #6d3fcf;
    }
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 2px;
      background-color: #6d3fcf;
    }
  }
`;
const CheckboxView = styled.label`
  width: 14px;
  height: 14px;
  border: 1px solid #aaaaaaaa;
  outline: 0;
  border-radius: 3px;
  margin-right: 5px;
  padding: 2px;

  &:hover {
    border: 1px solid #6d3fcf77;
  }
  &:active {
    border: 1px solid #6d3fcf;
  }
`;
const CheckboxLabel = styled.label`
  font-size: 12px;
  color: #999;
`;
