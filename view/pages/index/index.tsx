import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../common/Button";
import _Container from "../../common/Container";

export default function Index() {
  const navigate = useNavigate();

  return (
    <Container>
      <Button onClick={() => navigate("/signin")}>SIGN IN</Button>
    </Container>
  );
}

const Container = styled(_Container)``;
