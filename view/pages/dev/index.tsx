import _React, { useEffect, useState } from "react";
import styled from "styled-components";
import _Container from "../../common/Container";
import { HiCode } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { InputChangeEvent } from "../../../types";
import { useAxios } from "../../../functions/utils";
import { AxiosRequestConfig } from "axios";

export default function DevPage() {
  const dispatch = useDispatch();
  const [file, setFile] = useState<null | File>(null);

  const fileChange = (e: InputChangeEvent) => {
    let files = e?.target?.files;
    if (!files) return;
    let file = files[0];
    setFile(file);
  };

  const fileSave = () => {
    if (!file) return;
    let form = new FormData();
    form.append("FILE", file, file?.name);

    useAxios
      .post("/file", form, {
        "Content-Type": "multipart/form-data",
      } as AxiosRequestConfig<FormData>)
      .then(({ data }) => {
        if (!data?.result) return console.log("FILE 업로드 에러");

        console.log("FILE 업로드 성공!!");
      });
  };

  useEffect(fileSave, [file]);

  useEffect(() => {
    dispatch({ type: "customTitle", payload: "개발자 페이지" });
  }, []);

  return (
    <Container>
      {/* <Icon />
      <span>개발중</span> */}

      <input type="file" onChange={fileChange} />
    </Container>
  );
}

const Icon = styled(HiCode)`
  font-size: 200px;
`;
const Container = styled(_Container)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  font-weight: 700;
  color: #ccc;
  letter-spacing: 10px;
  text-indent: 10px;
  padding-bottom: 100px;
  flex-direction: column;
`;
