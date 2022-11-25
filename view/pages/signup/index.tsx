import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import _Container from "../../common/FullContainer";
import _Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import Header from "../../common/Header";
import termsList from "./terms";
import { Value } from "./index.type";

export default function Signup() {
  const navigate = useNavigate();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [value, setValue] = useState<Value>({ isTerms: false, name: "" });

  return (
    <Container>
      <Header activePage="회원가입" iconHide={true} />
      <Contents>
        <Section>
          {termsList?.map((item) => (
            <Row key={item?.id}>
              <RowTitle>{item?.title}</RowTitle>
              <TermText defaultValue={item?.text} readOnly />
            </Row>
          ))}
          <TermsOkBtn>모두동의</TermsOkBtn>
        </Section>
        <Section>
          <Row>
            <RowTitle>정보 입력</RowTitle>
            <InputContainer>
              <TextInput placeholder="이름을 입력해주세요." />
              <TextInput placeholder="연락처를 입력해주세요." />
            </InputContainer>
            <InputContainer>
              <TextInput placeholder="부서를 입력해주세요." />
              <TextInput placeholder="직급을 입력해주세요." />
            </InputContainer>
            <InputContainer>
              <TextInput placeholder="아이디를 입력해주세요." />
              <TextInput
                type="password"
                placeholder="패스워드를 입력해주세요."
              />
              <TextInput
                type="password"
                placeholder="패스워드를 입력해주세요."
              />
            </InputContainer>
          </Row>
          <SubmitBtn>회원가입</SubmitBtn>
        </Section>
      </Contents>
    </Container>
  );
}

const Container = styled(_Container)`
  width: 100%;
`;
const Contents = styled.section`
  width: calc(100% - 160px);
  height: calc(100% - 60px);
  margin-left: 160px;
  overflow: auto;
  padding-right: 10px;
`;
const Section = styled.article`
  margin-bottom: 40px;
  &:last-of-type {
    margin-bottom: 10px;
  }
`;
const Row = styled.div`
  margin-bottom: 20px;
`;
const RowTitle = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #555555;
  margin-bottom: 10px;
`;
const TermText = styled.textarea`
  padding: 6px 8px;
  width: 100%;
  height: 100px;
  color: #888;
  font-size: 12px;
  border: 1px solid #dddddd;
  resize: none;
`;
const TermsOkBtn = styled(Button)`
  width: 100%;
  letter-spacing: 10px;
  text-indent: 10px;
`;
const InputContainer = styled.section`
  display: flex;
  margin-bottom: 10px;
`;
const TextInput = styled(_Input)`
  flex: 1;
  max-width: 250px;
  height: 38px;
  margin-right: 10px;
`;
const SubmitBtn = styled(Button)`
  width: 100%;
  letter-spacing: 10px;
  text-indent: 10px;
`;
