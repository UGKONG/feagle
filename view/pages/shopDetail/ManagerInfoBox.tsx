import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import type { ManagerInfoBoxProps } from "./index.type";
import {
  CancelBtn,
  Contents,
  DelBtn,
  EditBtn,
  Editing,
  EditInput,
  Header,
  InfoBoxContainer,
  OkBtn,
  Row,
  RowContents,
  RowTitle,
  Title,
} from ".";
import { InputChangeEvent, Manager } from "../../../types";
import { useDispatch } from "react-redux";
import { useAxios, usePhoneNumber } from "../../../functions/utils";
import Tab from "../../common/Tab";
import { InfoBox, InfoBoxTitle } from "../deviceDetail";

const genderList = [
  { id: 1, name: "남자" },
  { id: 2, name: "여자" },
];

export default function ManagerInfoBox({
  data,
  getShopData,
}: ManagerInfoBoxProps) {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<Manager>(data as Manager);
  const shopNmRef = useRef<HTMLInputElement>(null);
  const shopNumRef = useRef<HTMLInputElement>(null);

  const setValue = (key: string, val: string | number): void => {
    setEditData((prev) => ({ ...prev, [key]: val }));
  };

  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  const submit = (): void => {
    useAxios.put("/manager/" + data?.MNG_SQ, editData).then(({ data }) => {
      if (!data?.result) return useAlert("error", data?.message);
      useAlert("success", "저장되었습니다.");
      setIsEdit(false);
      getShopData();
    });
  };

  const validate = (): void => {
    if (!editData?.MNG_NM?.replace(/ /g, "")) {
      setValue("MNG_NM", "");
      return shopNmRef?.current?.focus();
    }
    if (
      !editData?.MNG_NUM?.replace(/ /g, "") ||
      editData?.MNG_NUM?.length < 12
    ) {
      return shopNumRef?.current?.focus();
    }

    submit();
  };

  useEffect(() => {
    if (!data) return;
    setEditData(data);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (isEdit) {
      if (shopNmRef?.current) shopNmRef?.current?.focus();
    } else {
      setEditData(data);
    }
  }, [isEdit]);

  return (
    <Container>
      <InfoBoxTitle>
        매니저 정보
        <ButtonContainer>
          {isEdit ? (
            <>
              <Editing />
              <OkBtn onClick={validate} />
              <CancelBtn onClick={() => setIsEdit(false)} />
            </>
          ) : (
            <>
              <EditBtn onClick={() => setIsEdit(true)} />
            </>
          )}
        </ButtonContainer>
      </InfoBoxTitle>
      <Contents>
        <Row>
          <RowTitle>상호명</RowTitle>
          <RowContents>
            {isEdit ? (
              <EditInput
                childRef={shopNmRef}
                value={editData?.MNG_NM}
                onChange={(e: InputChangeEvent) =>
                  setValue("MNG_NM", e?.target?.value)
                }
              />
            ) : (
              data?.MNG_NM
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>연락처</RowTitle>
          <RowContents>
            {isEdit ? (
              <EditInput
                childRef={shopNumRef}
                value={editData?.MNG_NUM}
                onChange={(e: InputChangeEvent) =>
                  setValue("MNG_NUM", usePhoneNumber(e?.target?.value))
                }
              />
            ) : (
              data?.MNG_NUM
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>성별</RowTitle>
          <RowContents>
            {isEdit ? (
              <Tab
                list={genderList}
                active={editData?.MNG_GD ?? 1}
                onChange={(e) => setValue("MNG_GD", e)}
              />
            ) : data?.MNG_GD === 1 ? (
              "남자"
            ) : (
              "여자"
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>아이디</RowTitle>
          <RowContents>{data?.MNG_ID}</RowContents>
        </Row>
      </Contents>
    </Container>
  );
}

const Container = styled(InfoBox)`
  max-width: calc(50% - 5px);
`;
const ButtonContainer = styled.div`
  display: flex;
`;
