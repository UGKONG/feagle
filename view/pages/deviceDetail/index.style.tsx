import styled from "styled-components";
import _Input from "../../common/Input";

export const Header = styled.header`
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
export const HeaderSide = styled.div`
  height: 100%;
`;
export const Input = styled(_Input).attrs(() => ({
  type: "date",
}))`
  width: 130px;
  height: 34px;
  color: #555555;
`;
export const Margin = styled.span`
  display: inline-block;
  margin: 0 5px;
  color: #555555;
`;
export const Contents = styled.section`
  width: 100%;
  background-color: #fff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  flex: 1;
`;
