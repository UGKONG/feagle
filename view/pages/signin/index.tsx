import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import logoImg from "../../assets/images/logo.png";
import FullContainer from "../../common/FullContainer";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import { Key, Value, KeyDownEvent } from "./index.type";
import { useAxios } from "../../../functions/utils";
import { encode, decode } from "js-base64";
import { OrNull } from "../../../types";

export const storageKey = "feagleAutoLogin";
type Form = {
  MST_ID: string;
  MST_PW: string;
};

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<Value>({ id: "", pw: "", isKeep: false });

  const onChange = (key: Key, val: string | boolean) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  // 자동 로그인 체크
  const autoLoginCheck = (): void => {
    let value: OrNull<string> = localStorage.getItem(storageKey);
    if (!value) return;

    let decodeText: string = decode(value);
    try {
      let json = JSON.parse(decodeText);
      submit({ MST_ID: json?.id, MST_PW: json?.pw });
    } catch {
      localStorage.removeItem(storageKey);
      return;
    }
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
  const submit = async (currentForm?: Form) => {
    const isAuth: boolean = currentForm ? true : false;
    const form: Form = currentForm ?? { MST_ID: value?.id, MST_PW: value?.pw };
    const { data } = await useAxios.post("/master/login", form);

    if (!data?.result || !data?.current) {
      let text = data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
      dispatch({ type: "alert", payload: { type: "warning", text } });
      return;
    }

    dispatch({ type: "master", payload: data?.current });
    dispatch({
      type: "alert",
      payload: {
        type: "success",
        text: (isAuth ? "자동 " : "") + "로그인되었습니다.",
      },
    });
    navigate("/");

    if (value?.isKeep) {
      localStorage.setItem(storageKey, encode(JSON.stringify(value)));
    }
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

  useEffect(() => {
    if (idRef) idRef?.current?.focus();
    autoLoginCheck();
  }, []);

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
          onKeyDown={(e: KeyDownEvent) => e?.keyCode === 13 && validate()}
        />
        <Input
          childRef={pwRef}
          type="password"
          placeholder="비밀번호를 입력해주세요."
          value={value.pw}
          name="pw"
          onChange={changeValue}
          onKeyDown={(e: KeyDownEvent) => e?.keyCode === 13 && validate()}
        />
        <Options>
          <Checkbox label="자동 로그인" name="isKeep" onChange={changeValue} />
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
