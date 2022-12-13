import _React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import _Container from "../../common/FullContainer";
import _Input from "../../common/Input";
import Button from "../../common/Button";
import Header from "../../common/Header";
import termsList from "./terms";
import { Value } from "./index.type";
import {
  useAxios,
  usePhoneNumber,
  usePhoneValidate,
} from "../../../functions/utils";
import type { InputChangeEvent } from "../../../types";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const pw1Ref = useRef<HTMLInputElement>(null);
  const pw2Ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<Value>({
    isTerms: false,
    gender: 1,
    name: "",
    phone: "",
    group: "",
    position: "",
    id: "",
    pw1: "",
    pw2: "",
  });

  const isMan = useMemo(() => value?.gender === 1, [value?.gender]);

  const valueChange = (key: keyof Value, value: boolean | 1 | 2 | string) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    const form = {
      MST_NM: value?.name,
      MST_NUM: value?.phone,
      MST_GRP: value?.group,
      MST_PO: value?.position,
      MST_GD: value?.gender,
      MST_ID: value?.id,
      MST_PW: value?.pw1,
    };
    useAxios.post("/master", form).then(({ data }) => {
      if (!data?.result) {
        let text = data?.message || "회원가입에 실패하였습니다.";
        return dispatch({ type: "alert", payload: { type: "error", text } });
      }

      let text = "회원가입이 신청되었습니다.";
      dispatch({ type: "alert", payload: { type: "success", text } });
      navigate("/signin");
    });
  };

  const validateCheck = () => {
    if (!value?.isTerms) {
      return dispatch({
        type: "alert",
        payload: { type: "warning", text: "약관에 동의가 필요합니다." },
      });
    }
    if (!value?.name || value?.name?.length < 2) {
      valueChange("name", "");
      return nameRef.current?.focus();
    }
    if (!value?.phone || !usePhoneValidate(value?.phone)) {
      valueChange("phone", "");
      return phoneRef.current?.focus();
    }
    if (!value?.id || value?.id?.length < 4) {
      valueChange("id", "");
      return idRef.current?.focus();
    }
    if (!value?.pw1 || value?.pw1?.length < 4) {
      valueChange("pw1", "");
      valueChange("pw2", "");
      return pw1Ref.current?.focus();
    }
    if (!value?.pw2 || value?.pw1 !== value?.pw2) {
      valueChange("pw2", "");
      return pw2Ref.current?.focus();
    }

    submit();
  };

  return (
    <Container>
      <Header
        isMainPage={true}
        activePage="회원가입"
        iconHide={true}
        logoClick="/signin"
      />
      <Contents>
        <Section>
          {termsList?.map((item) => (
            <Row key={item?.id}>
              <RowTitle>{item?.title}</RowTitle>
              <TermText defaultValue={item?.text} readOnly />
            </Row>
          ))}
          <TermsOkBtn
            disabled={value?.isTerms}
            onClick={() => valueChange("isTerms", true)}
          >
            모두동의
          </TermsOkBtn>
        </Section>
        <Section>
          <Row>
            <RowTitle>정보 입력</RowTitle>
            <RowSubTitle>필수 입력</RowSubTitle>
            <InputContainer>
              <TextInput
                placeholder="이름을 입력해주세요."
                childRef={nameRef}
                value={value?.name ?? ""}
                onChange={(e: InputChangeEvent) =>
                  valueChange("name", e?.target?.value)
                }
              />
              <TextInput
                placeholder="연락처를 입력해주세요."
                childRef={phoneRef}
                maxLength="13"
                value={value?.phone ?? ""}
                onChange={(e: InputChangeEvent) =>
                  valueChange("phone", usePhoneNumber(e?.target?.value))
                }
              />
              <GenderContainer>
                <GenderItem
                  className={isMan ? "active" : ""}
                  onClick={() => valueChange("gender", 1)}
                >
                  남자
                </GenderItem>
                <GenderItem
                  className={!isMan ? "active" : ""}
                  onClick={() => valueChange("gender", 2)}
                >
                  여자
                </GenderItem>
              </GenderContainer>
            </InputContainer>
            <InputContainer>
              <TextInput
                placeholder="아이디를 입력해주세요."
                childRef={idRef}
                value={value?.id}
                onChange={(e: InputChangeEvent) =>
                  valueChange("id", e?.target?.value)
                }
              />
              <TextInput
                type="password"
                placeholder="패스워드를 입력해주세요."
                childRef={pw1Ref}
                value={value?.pw1}
                onChange={(e: InputChangeEvent) =>
                  valueChange("pw1", e?.target?.value)
                }
              />
              <TextInput
                type="password"
                placeholder="패스워드를 입력해주세요."
                childRef={pw2Ref}
                value={value?.pw2}
                onChange={(e: InputChangeEvent) =>
                  valueChange("pw2", e?.target?.value)
                }
              />
            </InputContainer>

            <RowSubTitle>선택 입력</RowSubTitle>
            <InputContainer>
              <TextInput
                placeholder="부서를 입력해주세요."
                value={value?.group}
                onChange={(e: InputChangeEvent) =>
                  valueChange("group", e?.target?.value)
                }
              />
              <TextInput
                placeholder="직급을 입력해주세요."
                value={value?.position}
                onChange={(e: InputChangeEvent) =>
                  valueChange("position", e?.target?.value)
                }
              />
            </InputContainer>
          </Row>
          <SubmitBtn onClick={validateCheck}>회원가입</SubmitBtn>
        </Section>
      </Contents>
    </Container>
  );
}

const Container = styled(_Container)`
  width: 100%;
  height: 100%;
`;
const Contents = styled.section`
  padding-left: 160px;
  height: calc(100% - 60px);
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
const RowSubTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #777777;
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
const GenderContainer = styled.div`
  border-radius: 100px;
  overflow: hidden;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
`;
const GenderItem = styled.div`
  min-width: 60px;
  flex: 1;
  height: 100%;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  color: #777777;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    color: #555555;
  }

  &.active {
    background-color: #8a69d1;
    color: #fff;
  }
`;
