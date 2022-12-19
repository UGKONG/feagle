import _React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAxios, useDate, useIsNumber } from "../../../functions/utils";
import { CommonCode, InputChangeEvent } from "../../../types";
import BarChart from "../../common/BarChart";
import Tab from "../../common/Tab";
import { Header, Contents, Input, Margin, HeaderSide } from "./index.style";
import { ChartData, ChartDate } from "./index.type";

export default function DataChartModal({}) {
  const params = useParams();
  const [typeList, setTypeList] = useState<CommonCode[]>([]);
  const [date, setDate] = useState<ChartDate>({ start: "", end: "", type: 1 });
  const [data, setData] = useState([]);

  const DEVICE_SQ = useMemo<number>(() => Number(params?.id), [params]);

  const customTypeList = useMemo(
    () =>
      typeList?.map((item) => ({
        id: item?.COMM_CODE,
        name: item?.COMM_NM,
      })),
    [typeList]
  );

  const changeDate = (key: keyof ChartDate, val: string | number): void => {
    setDate((prev) => ({ ...prev, [key]: val }));
  };

  const init = (): void => {
    let now = new Date();
    let end = useDate(now, false);
    now.setDate(1);
    let start = useDate(now, false);
    setDate({ start, end, type: 1 });
    getTypeList();
  };

  const getTypeList = (): void => {
    useAxios.get("/common/dataType").then(({ data }) => {
      setTypeList(data?.current ?? []);
    });
  };

  const getData = (): void => {
    if (
      !useIsNumber(DEVICE_SQ) ||
      date?.start?.length < 10 ||
      date?.end?.length < 10 ||
      !date?.type
    ) {
      return;
    }

    let url = `/device/useChart/${DEVICE_SQ}?`;
    let query = `start=${date?.start}&end=${date?.end}&type=${date?.type}`;
    useAxios.get(url + query).then(({ data }) => {
      if (!data?.result) return setData([]);
      let list = data?.current?.map((x: ChartData) => ({
        name: x?.COMM_NM,
        value: x?.VALUE,
      }));
      setData(list);
    });
  };

  useEffect(init, []);
  useEffect(getData, [date]);

  return (
    <Container>
      <Header>
        <HeaderSide>
          <Input
            value={date?.start}
            onChange={(e: InputChangeEvent) =>
              changeDate("start", e?.target?.value)
            }
          />
          <Margin>~</Margin>
          <Input
            value={date?.end}
            onChange={(e: InputChangeEvent) =>
              changeDate("end", e?.target?.value)
            }
          />
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
        <BarChart data={data} />
      </Contents>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;
