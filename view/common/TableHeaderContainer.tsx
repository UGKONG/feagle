import React from "react";
import styled from "styled-components";
import { InputChangeEvent, SetState } from "../../types";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import _Input from "./Input";

type Active = { sort: number; dir: "ASC" | "DESC"; filter: string };
interface Props {
  list: Array<{ id: number; name: string }>;
  active: Active;
  setActive: SetState<Active>;
  count?: number;
}
export default function TableHeaderContainer({
  list,
  active,
  setActive,
  count = 0,
}: Props) {
  const isFilterActive = (id: number): boolean => active?.sort === id;

  return (
    <Container>
      <Side>
        {list?.length > 0 ? (
          <>
            <Filter>
              {list?.map((item) => (
                <FilterItem
                  key={item?.id}
                  className={isFilterActive(item?.id) ? "active" : ""}
                  onClick={() =>
                    setActive((prev) => ({ ...prev, sort: item?.id }))
                  }
                >
                  {item?.name ?? "-"}
                </FilterItem>
              ))}
            </Filter>
            <Dir>
              <DirItem
                className={active?.dir === "ASC" ? "active" : ""}
                onClick={() => setActive((prev) => ({ ...prev, dir: "ASC" }))}
              >
                <AiOutlineArrowUp />
              </DirItem>
              <DirItem
                className={active?.dir === "DESC" ? "active" : ""}
                onClick={() => setActive((prev) => ({ ...prev, dir: "DESC" }))}
              >
                <AiOutlineArrowDown />
              </DirItem>
            </Dir>
          </>
        ) : null}
      </Side>
      <Side>
        <Count>{count ?? 0}개</Count>
        <Input
          value={active?.filter}
          placeholder="검색"
          onChange={(e: InputChangeEvent) =>
            setActive((prev) => ({ ...prev, filter: e?.target?.value }))
          }
        />
      </Side>
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const Side = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;
const Filter = styled.div`
  height: 30px;
  background-color: #fff;
  position: relative;
  margin-left: 40px;
  display: flex;
  font-size: 12px;
  border-radius: 100px;

  &::before {
    content: "정렬";
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(calc(-50% - 1px));
    white-space: nowrap;
    color: #aaa;
  }
`;
const FilterItem = styled.div`
  padding: 0 14px 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  white-space: nowrap;
  transition: 0.2s;
  border-radius: 100px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: #888;
  }
  &.active {
    color: #fff;
    background-color: #8b61dc;
  }
`;
const Dir = styled.div`
  height: 30px;
  margin-left: 10px;
  display: flex;
  font-size: 12px;
  border-radius: 100px;
  background-color: #fff;
`;
const DirItem = styled.div`
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  white-space: nowrap;
  transition: 0.2s;
  border-radius: 100px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: #888;
  }
  &.active {
    color: #fff;
    background-color: #8b61dc;
  }
`;
const Input = styled(_Input)`
  min-width: 200px;
  height: 30px;
  border-radius: 100px;
  padding: 0 14px;
  border: 1px solid transparent;
`;
const Count = styled.div`
  margin-right: 10px;
  white-space: nowrap;
  font-size: 12px;
  color: #aaa;
`;
