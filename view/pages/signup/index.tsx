import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logoImg from "../../assets/images/logo.png";
import FullContainer from "../../common/FullContainer";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
// import { Value } from "./index.type";

export default function Signup() {
  // const navigate = useNavigate();
  // const idRef = useRef<HTMLInputElement>(null);
  // const pwRef = useRef<HTMLInputElement>(null);
  // const [value, setValue] = useState<Value>({ id: "", pw: "", isKeep: false });

  // const onChange = (key: "id" | "pw" | "isKeep", val: string | boolean) => {
  //   setValue((prev) => ({ ...prev, [key]: val }));
  // };

  // // id value 변경
  // const idChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange("id", e?.target?.value ?? "");
  // };

  // // pw value 변경
  // const pwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange("pw", e?.target?.value ?? "");
  // };

  // // 로그인 유지 체크 변경
  // const signinKeepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange("isKeep", e?.target?.checked ?? false);
  // };

  // // 회원가입 페이지 이동
  // const goSignUpPage = () => {
  //   navigate("/signup");
  // };

  // // 로그인 정보 전송
  // const submit = () => {
  //   navigate("/");
  //   alert(JSON.stringify(value));
  // };

  // // 로그인 정보 유효성 검사
  // const validate = () => {
  //   if (!value?.id || value?.id?.length < 4) {
  //     return idRef.current && idRef.current.focus();
  //   }
  //   if (!value?.pw || value?.pw?.length < 4) {
  //     return pwRef.current && pwRef.current.focus();
  //   }
  //   submit();
  // };

  return <Container>SIGN UP</Container>;
}

const Container = styled(FullContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
