import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../common/Button";
import _Container from "../../common/Container";

export default function Index() {
  const navigate = useNavigate();

  return (
    <Container>
      메인페이지
      <br />
      <Button onClick={() => navigate("/signin")}>go to signin page</Button>
    </Container>
  );
}

const Container = styled(_Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
`;
