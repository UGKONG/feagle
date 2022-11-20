import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoImg from "../../assets/images/logo.png";
import _Container from "../../common/Container";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import { Value } from "./index.type";

export default function Signin() {
  const navigate = useNavigate();
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<Value>({ id: "", pw: "", isKeep: false });

  const onChange = (key: "id" | "pw" | "isKeep", val: string | boolean) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  // id value 변경
  const idChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("id", e?.target?.value ?? "");
  };

  // pw value 변경
  const pwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("pw", e?.target?.value ?? "");
  };

  // 로그인 유지 체크 변경
  const signinKeepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange("isKeep", e?.target?.checked ?? false);
  };

  // 회원가입 페이지 이동
  const goSignUpPage = () => {
    navigate("/signup");
  };

  // 로그인 정보 전송
  const submit = () => {
    navigate("/");
    alert(JSON.stringify(value));
  };

  // 로그인 정보 유효성 검사
  const validate = () => {
    if (!value?.id || value?.id?.length < 4) {
      return idRef.current && idRef.current.focus();
    }
    if (!value?.pw || value?.pw?.length < 4) {
      return pwRef.current && pwRef.current.focus();
    }
    submit();
  };

  return (
    <Container>
      <Logo />
      <Form>
        <Input
          childRef={idRef}
          placeholder="아이디를 입력해주세요."
          value={value.id}
          onChange={idChange}
        />
        <Input
          childRef={pwRef}
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={value.pw}
          onChange={pwChange}
        />
        <Options>
          <Checkbox label="로그인 유지" onChange={signinKeepChange} />
          <SignupBtn onClick={goSignUpPage}>회원가입</SignupBtn>
        </Options>
        <SigninBtn onClick={validate}>로그인</SigninBtn>
      </Form>
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
  letter-spacing: 1px;
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
const SigninBtn = styled(Button)`
  margin: 40px 0 50px;
`;
