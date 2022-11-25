import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import logoImg from "../../assets/images/logo.png";
import FullContainer from "../../common/FullContainer";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import { Key, Value } from "./index.type";
import { useAxios } from "../../../functions/utils";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<Value>({ id: "", pw: "", isKeep: false });

  const onChange = (key: Key, val: string | boolean) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  // value 변경
  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e?.target;
    const key: Key = target?.name as Key;
    let val: string | boolean;
    if (key === "isKeep") {
      val = e?.target?.checked ?? false;
    } else {
      val = e?.target?.value ?? "";
    }
    onChange(key, val);
  };

  // 회원가입 페이지 이동
  const goSignUpPage = () => navigate("/signup");

  // 로그인 정보 전송
  const submit = async () => {
    const form = { MST_ID: value?.id, MST_PW: value?.pw };
    const { data } = await useAxios.post("/master/login", form);

    if (!data?.result || !data?.current) return console.log("로그인 실패");

    dispatch({ type: "master", payload: data?.current });
    navigate("/");
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
          name="id"
          onChange={changeValue}
        />
        <Input
          childRef={pwRef}
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={value.pw}
          name="pw"
          onChange={changeValue}
        />
        <Options>
          <Checkbox label="로그인 유지" name="isKeep" onChange={changeValue} />
          <SignupBtn onClick={goSignUpPage}>회원가입</SignupBtn>
        </Options>
        <SigninBtn onClick={validate}>로그인</SigninBtn>
      </Form>
    </Container>
  );
}

const Container = styled(FullContainer)`
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
