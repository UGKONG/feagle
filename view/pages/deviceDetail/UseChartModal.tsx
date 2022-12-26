import _React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAxios, useDate, useIsNumber } from "../../../functions/utils";
import { InputChangeEvent } from "../../../types";
import BarChart from "../../common/BarChart";
import { Header, Contents, Input, Margin, HeaderSide } from "./index.style";
import { UseChartData, ChartDate } from "./index.type";

export default function UseChartModal() {
  const params = useParams();
  const [date, setDate] = useState<ChartDate>({ start: "", end: "" });
  const [data, setData] = useState([]);

  const DEVICE_SQ = useMemo<number>(() => Number(params?.id), [params]);

  const changeDate = (key: "start" | "end", val: string): void => {
    setDate((prev) => ({ ...prev, [key]: val }));
  };

  const init = (): void => {
    let now = new Date();
    let end = useDate(now, false);
    now.setDate(1);
    let start = useDate(now, false);
    setDate({ start, end, type: 1 });
  };

  const getData = (): void => {
    if (
      !useIsNumber(DEVICE_SQ) ||
      date?.start?.length < 10 ||
      date?.end?.length < 10
    ) {
      return;
    }

    let url = `/device/useChart/${DEVICE_SQ}?`;
    let query = `start=${date?.start}&end=${date?.end}`;
    useAxios.get(url + query).then(({ data }) => {
      if (!data?.result) return setData([]);
      let list = data?.current?.map((x: UseChartData) => ({
        name: x?.COMM_NM,
        value: x?.VALUE,
      }));
      setData(list);
    });
  };

  useEffect(getData, [date]);
  useEffect(init, []);

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
