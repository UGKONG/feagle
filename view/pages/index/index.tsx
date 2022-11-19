import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Index() {
  return (
    <main>
      메인페이지
      <br />
      <Link to="/login">go to login page</Link>
    </main>
  );
}
