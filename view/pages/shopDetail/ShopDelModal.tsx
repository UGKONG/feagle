import _React, { useRef } from "react";
import styled from "styled-components";
import _Input from "../../common/Input";
import { ShopDelModalProps } from "./index.type";

export default function ShopDelModal({ delInputRef }: ShopDelModalProps) {
  return (
    <Container>
      <Description>
        피부샵 정보를 비활성화 하시겠습니까?
        <br />
        아래 항목을 확인해주세요.
      </Description>

      <Description style={{ color: "#f00" }}>
        1. 피부샵의 상태가 비활성화로 전환됩니다.
        <br />
        2. 피부샵측 앱 사용이 불가능합니다.
        <br />
        3. 피부샵 보유 장비의 사용 데이터가 수집되지 않습니다.
        <br />
        <br />
        비활성화를 원하시면 '피부샵 비활성' 라고 적어주세요.
      </Description>
      <Input childRef={delInputRef} placeholder="피부샵 비활성" />
    </Container>
  );
}

const Container = styled.section``;
const Description = styled.article`
  line-height: 30px;
  margin-bottom: 30px;
`;
const Input = styled(_Input)`
  width: 150px;
  height: 35px;
`;
