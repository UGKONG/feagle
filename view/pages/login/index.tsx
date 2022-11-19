import React, { useState } from "react";
import styled from "styled-components";
import logoImg from "../../assets/images/logo.png";
import _Container from "../../common/Container";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import { Value } from "./index.type";
import SignupModal from "./SignupModal";

export default function Login() {
  const [isSignupModal, setIsSignupModal] = useState(false);
  const [value, setValue] = useState<Value>({ id: "", pw: "", isKeep: false });

  const onChange = (key: "id" | "pw", val: string) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  const idChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("id", e?.target?.value ?? "");
  };

  const pwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("pw", e?.target?.value ?? "");
  };

  return (
    <Container>
      <Logo />
      <Form>
        <Input
          placeholder="아이디를 입력해주세요."
          value={value.id}
          onChange={idChange}
        />
        <Input
          placeholder="비밀번호를 입력해주세요."
          value={value.pw}
          onChange={pwChange}
        />
        <Options>
          <Checkbox label="로그인 유지" />
          <SignupBtn onClick={() => setIsSignupModal(true)}>회원가입</SignupBtn>
        </Options>
      </Form>

      {isSignupModal && <SignupModal />}
    </Container>
  );
}

const Container = styled(_Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const Logo = styled.h1`
  height: 100px;
  aspect-ratio: 322/85;
  background: url("${logoImg}") no-repeat center;
  margin-bottom: 40px;
`;
const Form = styled.section`
  display: flex;
  flex-direction: column;
`;
const Input = styled(_Input)`
  margin-bottom: 6px !important;
  width: 270px;
`;
const Options = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SignupBtn = styled.button`
  color: #aaa;
  font-size: 12px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
