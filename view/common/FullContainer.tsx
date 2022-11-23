import _React from "react";
import styled from "styled-components";

export default function FullContainer(props: any) {
  return <ContainerTag {...props}>{props?.children ?? null}</ContainerTag>;
}
const ContainerTag = styled.main``;
