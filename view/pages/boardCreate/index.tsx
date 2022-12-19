import _React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../../../functions/utils";
import {
  AlertType,
  CommonCode,
  DeviceModel,
  File,
  InputChangeEvent,
  Post,
  SelectChangeEvent,
} from "../../../types";
import _Container from "../../common/Container";
import Button from "../../common/Button";
import _Select from "../../common/Select";
import _Input from "../../common/Input";
import _Textarea from "../../common/Textarea";
import { useSelector } from "react-redux";
import { Store } from "../../../functions/store";

export default function BoardCreate() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const title = location?.state;
  const loginUser = useSelector((x: Store) => x?.master);

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const modelRef = useRef<HTMLSelectElement>(null);
  const versionRef = useRef<HTMLInputElement>(null);
  const versionDateRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<CommonCode[]>([]);
  const [modelList, setModelList] = useState<DeviceModel[]>([]);
  const [fileList, setFileList] = useState<null | FileList>(null);
  const [value, setValue] = useState<Post>({
    POST_TP: 0,
    MDL_SQ: 0,
    BUILD_VN: "",
    POST_TTL: "",
    POST_CN: "",
    BUILD_DT: "",
    MST_SQ: loginUser?.MST_SQ ?? 0,
  });

  // 알림
  const useAlert = (type: AlertType, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  // 모델 리스트 조회
  const getList = (): void => {
    dispatch({
      type: "customTitle",
      payload: `신규 ${title || "게시글"} 작성`,
    });
    useAxios.get("/model").then(({ data }) => {
      setModelList(data?.result ? data?.current : []);

      // 카테고리 리스트 조회
      useAxios.get("/common/boardType").then(({ data }) => {
        setIsLoading(false);
        setCategoryList(data?.result ? data?.current : []);
      });
    });
  };

  // 값 변경
  const changeValue = (key: string, val: any): void => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  // 전송
  const submit = (): void => {
    let form = new FormData();
    let keys = Object.keys(value);
    console.log(keys);
    keys.forEach((key) => form.append(key, (value as any)[key]));

    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        form.append("FILES", fileList[i]);
      }
    }

    for (let key of form.keys()) {
      console.log(key, ":", form.get(key));
    }

    let config = { headers: { "content-type": "multipart/form-data" } };
    useAxios.post("/board", form, config).then(({ data }) => {
      if (!data?.result) return useAlert("error", "저장에 실패하였습니다.");
      useAlert("success", "저장되었습니다.");
      navigate(-1);
    });
  };

  // 유효성 검사
  const validate = (): void => {
    if (!value?.POST_TTL) return titleRef.current?.focus();
    if (!value?.POST_TP) return categoryRef.current?.focus();
    if (!value?.MDL_SQ) return modelRef.current?.focus();
    if (!value?.BUILD_VN) return versionRef.current?.focus();
    if (!value?.BUILD_DT) return versionDateRef.current?.focus();
    if (!value?.POST_CN) return contentsRef.current?.focus();
    if (value?.BUILD_DT?.length < 10) {
      useAlert("warning", "빌드일자를 정확히 선택해주세요.");
      return versionDateRef.current?.focus();
    }

    submit();
  };

  // 파일 변경
  const fileChange = (e: InputChangeEvent): void => {
    setFileList(e?.target?.files);
  };

  // 파일 삭제
  const fileDelete = (): void => {
    if (fileRef.current) fileRef.current.value = "";
    setFileList(null);
  };

  useEffect(getList, []);

  return (
    <Container isLoading={isLoading}>
      <Header>
        <SaveBtn onClick={validate} />
        <BackBtn onClick={() => navigate(-1)}>뒤로가기</BackBtn>
      </Header>
      <Title>
        제목:{" "}
        <Input
          value={value?.POST_TTL ?? ""}
          onChange={(e: InputChangeEvent) =>
            changeValue("POST_TTL", e?.target?.value)
          }
          childRef={titleRef}
          style={{ width: 500, height: 44, fontSize: 20 }}
          placeholder="제목을 입력해주세요."
        />
      </Title>
      <Row style={{ fontSize: 16 }}>
        <RowTitle>카테고리 :</RowTitle>
        <Select
          value={value?.POST_TP ?? 0}
          onChange={(e: SelectChangeEvent) =>
            changeValue("POST_TP", Number(e?.target?.value))
          }
          childRef={categoryRef}
        >
          <option value={0}>선택해주세요.</option>
          {categoryList?.map((item) => (
            <option key={item?.COMM_CODE} value={item?.COMM_CODE}>
              {item?.COMM_NM}
            </option>
          ))}
        </Select>
      </Row>
      <Row>
        <RowTitle>적용모델 :</RowTitle>
        <Select
          value={value?.MDL_SQ ?? 0}
          onChange={(e: SelectChangeEvent) =>
            changeValue("MDL_SQ", Number(e?.target?.value))
          }
          childRef={modelRef}
        >
          <option value={0}>선택해주세요.</option>
          {modelList?.map((item) => (
            <option key={item?.MDL_SQ} value={item?.MDL_SQ}>
              {item?.MDL_NM} {item?.MDL_EN_NM ? `(${item?.MDL_EN_NM})` : ""}
            </option>
          ))}
        </Select>
      </Row>
      <Row>
        <RowTitle>빌드정보 :</RowTitle>
        <Input
          value={value?.BUILD_VN ?? ""}
          onChange={(e: InputChangeEvent) =>
            changeValue("BUILD_VN", e?.target?.value)
          }
          childRef={versionRef}
          style={{ width: 200 }}
          placeholder="빌드 버전"
        />
        <Input
          value={value?.BUILD_DT ?? ""}
          onChange={(e: InputChangeEvent) =>
            changeValue("BUILD_DT", e?.target?.value)
          }
          childRef={versionDateRef}
          type="date"
          style={{ width: 130 }}
          placeholder="빌드 일시"
        />
      </Row>
      <Row
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 30,
          minHeight: 250,
        }}
      >
        <RowTitle style={{ marginBottom: 6 }}>내용</RowTitle>
        <Textarea
          value={value?.POST_CN ?? ""}
          onChange={(e: InputChangeEvent) =>
            changeValue("POST_CN", e?.target?.value)
          }
          childRef={contentsRef}
          placeholder="내용을 입력하세요."
        />
      </Row>
      <Row style={{ marginTop: 50 }}>
        <RowTitle style={{ marginBottom: 6 }}>첨부파일</RowTitle>
        <input
          id="file"
          ref={fileRef}
          type="file"
          onChange={fileChange}
          multiple
          hidden
        />
        {!fileList?.length ? (
          <FileBtn htmlFor="file" />
        ) : (
          <BackBtn style={{ margin: 0 }} onClick={fileDelete}>
            파일삭제 (파일수 : {fileList?.length})
          </BackBtn>
        )}
      </Row>
    </Container>
  );
}

const Container = styled(_Container)`
  min-height: calc(100% - 60px);
  overflow: auto;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
const HeaderBtn = styled(Button)`
  margin-left: 6px;
  height: 32px;
  border: none;
  box-shadow: none;
`;
const SaveBtn = styled(HeaderBtn)`
  &::before {
    content: "저장";
  }
`;
const BackBtn = styled(HeaderBtn)`
  background-color: #999999;
  &:hover {
    background-color: #888888;
  }
  &:active {
    background-color: #777777;
  }
`;
const Title = styled.p`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 30px;
  color: #333333;
  display: flex;
  align-items: center;
  letter-spacing: 2px;
`;
const Row = styled.div`
  font-size: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;
const RowTitle = styled.p`
  width: 70px;
  font-weight: 500;
`;
const Select = styled(_Select)`
  width: 200px;
  height: 34px;
  margin-left: 5px;
`;
const Input = styled(_Input)`
  width: 400px;
  height: 34px;
  margin-left: 5px;
  color: #666666;
`;
const Textarea = styled(_Textarea)`
  height: 300px;
`;
const FileBtn = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  padding: 0 14px;
  font-size: 13px;
  outline: 0;
  color: #fff;
  background-color: #8b61dc;
  cursor: pointer;
  letter-spacing: 1px;
  transition: 0.2s;
  white-space: nowrap;
  &::before {
    content: "파일선택";
  }
`;
