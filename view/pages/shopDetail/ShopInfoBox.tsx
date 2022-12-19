import _React, { useEffect, useRef, useState } from "react";
import {
  CancelBtn,
  Contents,
  DelBtn,
  EditBtn,
  Editing,
  EditInput,
  OkBtn,
  Row,
  RowContents,
  RowTitle,
} from ".";
import { InputChangeEvent, ShopDetail } from "../../../types";
import type { ShopInfoBoxProps } from "./index.type";
import { useAxios, usePhoneNumber } from "../../../functions/utils";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import _Button from "../../common/Button";
import { useParams } from "react-router-dom";
import { InfoBox, InfoBoxTitle } from "../deviceDetail";

export default function ShopInfoBox({
  data,
  getShopData,
  setIsDelModal,
}: ShopInfoBoxProps) {
  const params = useParams();
  const SHOP_ID = params?.id;
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<ShopDetail>(data as ShopDetail);
  const shopNmRef = useRef<HTMLInputElement>(null);
  const shopNumRef = useRef<HTMLInputElement>(null);
  const shopAddRef = useRef<HTMLInputElement>(null);

  const setValue = (key: string, val: string): void => {
    setEditData((prev) => ({ ...prev, [key]: val }));
  };

  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  const unDel = (): void => {
    useAxios.post("/shop/" + SHOP_ID).then(({ data }) => {
      if (!data?.result)
        return useAlert("error", "비활성 해제에 실패하였습니다.");
      useAlert("success", "피부샵이 활성되었습니다.");
      getShopData();
    });
  };

  const submit = (): void => {
    useAxios.put("/shop/" + data?.SHOP_SQ, editData).then(({ data }) => {
      if (!data?.result) return useAlert("error", data?.message);
      useAlert("success", "저장되었습니다.");
      setIsEdit(false);
      getShopData();
    });
  };

  const validate = (): void => {
    if (!editData?.SHOP_NM?.replace(/ /g, "")) {
      setValue("SHOP_NM", "");
      return shopNmRef?.current?.focus();
    }
    if (
      !editData?.SHOP_NUM?.replace(/ /g, "") ||
      editData?.SHOP_NUM?.length < 12
    ) {
      return shopNumRef?.current?.focus();
    }
    if (!editData?.SHOP_ADD?.replace(/ /g, "")) {
      return shopAddRef?.current?.focus();
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
        피부샵 정보
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
              {data?.IS_DEL === 0 && (
                <DelBtn onClick={() => setIsDelModal(true)} />
              )}
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
                value={editData?.SHOP_NM}
                onChange={(e: InputChangeEvent) =>
                  setValue("SHOP_NM", e?.target?.value)
                }
              />
            ) : (
              data?.SHOP_NM
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>연락처</RowTitle>
          <RowContents>
            {isEdit ? (
              <EditInput
                childRef={shopNumRef}
                value={editData?.SHOP_NUM}
                onChange={(e: InputChangeEvent) =>
                  setValue("SHOP_NUM", usePhoneNumber(e?.target?.value))
                }
              />
            ) : (
              data?.SHOP_NUM
            )}
          </RowContents>
        </Row>
        <Row>
          <RowTitle>주소</RowTitle>
          <RowContents>
            {isEdit ? (
              <EditInput
                childRef={shopAddRef}
                value={editData?.SHOP_ADD}
                onChange={(e: InputChangeEvent) =>
                  setValue("SHOP_ADD", e?.target?.value)
                }
              />
            ) : (
              data?.SHOP_ADD
            )}
          </RowContents>
        </Row>
        {data?.IS_DEL === 1 && <UnDelBtn onClick={unDel}>비활성 해제</UnDelBtn>}
      </Contents>
    </Container>
  );
}

const Container = styled(InfoBox)`
  max-width: calc(50% - 5px);
`;
const UnDelBtn = styled(_Button)`
  box-shadow: none;
  background-color: #ff7979;
  &:hover {
    background-color: #ff5a5a;
  }
  &:active {
    background-color: #fc2424;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
`;
