import _React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAxios, useIsNumber } from "../../../functions/utils";
import { CommonCode, SelectChangeEvent } from "../../../types";
import BarChart from "../../common/BarChart";
import Tab from "../../common/Tab";
import { Header, Contents, Select, Margin, HeaderSide } from "./index.style";
import { DataChartData, DataChartDate } from "./index.type";

export default function DataChartModal({}) {
  const params = useParams();
  const [typeList, setTypeList] = useState<CommonCode[]>([]);
  const [date, setDate] = useState<DataChartDate>({
    year: String(new Date().getFullYear()),
    type: 1,
  });
  const [data, setData] = useState([]);

  const DEVICE_SQ = useMemo<number>(() => Number(params?.id), [params]);

  const yearList = useMemo<number[]>(() => {
    let now = new Date();
    let start = 2022;
    let end = now?.getFullYear();
    let result: number[] = [];

    for (let i = 0; i <= end - start; i++) {
      result.push(start + i);
    }
    console.log(result);
    return result;
  }, []);

  const customTypeList = useMemo(
    () =>
      typeList?.map((item) => ({
        id: item?.COMM_CODE,
        name: item?.COMM_NM,
      })),
    [typeList]
  );

  const changeDate = (key: keyof DataChartDate, val: string | number): void => {
    setDate((prev) => ({ ...prev, [key]: val }));
  };

  const getTypeList = (): void => {
    useAxios.get("/common/dataType").then(({ data }) => {
      setTypeList(data?.current ?? []);
    });
  };

  const getData = (): void => {
    if (!useIsNumber(DEVICE_SQ) || !date?.year || !date?.type) {
      return;
    }

    let url = `/device/dataChart/${DEVICE_SQ}?`;
    let query = `year=${date?.year}&type=${date?.type}`;

    useAxios.get(url + query).then(({ data }) => {
      if (!data?.result) return setData([]);
      let list = data?.current?.map((x: DataChartData) => ({
        name: x?.MONTH_NM,
        value: x?.VALUE,
      }));
      setData(list);
    });
  };

  useEffect(getTypeList, []);
  useEffect(getData, [date]);

  return (
    <Container>
      <Header>
        <HeaderSide>
          <Select
            value={date?.year ?? ""}
            onChange={(e: SelectChangeEvent) => {
              changeDate("year", e?.target?.value);
            }}
          >
            {yearList.map((d) => (
              <option key={d} value={d}>
                {d}년
              </option>
            ))}
          </Select>
        </HeaderSide>
        <HeaderSide>
          <Tab
            height={34}
            list={customTypeList}
            active={date?.type as number}
            onChange={(value) => changeDate("type", value)}
          />
        </HeaderSide>
      </Header>
      <Contents>
        <BarChart data={data} label="평균" />
      </Contents>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;
