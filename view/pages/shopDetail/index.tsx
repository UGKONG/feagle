import _React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAxios, useIsNumber } from "../../../functions/utils";
import { ShopDetail } from "../../../types";
import _Container from "../../common/Container";
import _Input from "../../common/Input";
import ShopInfoBox from "./ShopInfoBox";
import ManagerInfoBox from "./ManagerInfoBox";
import { BsPencilSquare, BsLockFill, BsCheckLg } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import DeviceList from "../device";
import Modal from "../../common/Modal";
import ShopDelModal from "./ShopDelModal";
import Tab from "../../common/Tab";
import Button from "../../common/Button";
import CreateDeviceModal from "./CreateDeviceModal";
import { Device } from "../shop/index.type";
import HistoryList from "../history";
import StateList from "../state";

export default function ShopDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SHOP_SQ = params?.id;
  const delInputRef = useRef<HTMLInputElement>(null);
  const [isDelModal, setIsDelModal] = useState<boolean>(false);
  const [isCreateDeviceModal, setIsCreateDeviceModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shopData, setShopData] = useState<ShopDetail | null>(null);
  const [activeDeviceTab, setActiveDeviceTab] = useState<number>(1);
  const [deviceList, setDeviceList] = useState<Device[]>([
    {
      ID: 1,
      MDL_SQ: "",
      DEVICE_SN: "",
      DEVICE_BUY_DT: "",
      DEVICE_INSTL_DT: "",
    },
  ]);

  // useAlert
  const useAlert = (type: string, text: string): void => {
    dispatch({ type: "alert", payload: { type, text } });
  };

  // 비활성화
  const del = (): void => {
    if (!delInputRef?.current) return;
    let val = delInputRef?.current?.value;
    if (!val) return delInputRef?.current?.focus();
    if (val !== "피부샵 비활성") {
      delInputRef.current.value = "";
      return delInputRef?.current?.focus();
    }

    useAxios.delete("/shop/" + SHOP_SQ).then(({ data }) => {
      if (!data?.result) return useAlert("error", "비활성에 실패하였습니다.");
      useAlert("success", "피부샵이 비활성되었습니다.");
      setIsDelModal(false);
      getShopData();
    });
  };

  // 샵 정보 조회
  const getShopData = (): void => {
    if (!SHOP_SQ || !useIsNumber(SHOP_SQ)) return navigate(-1);
    useAxios.get("/shop/" + SHOP_SQ).then(({ data }) => {
      setIsLoading(false);
      setShopData(data?.current);

      dispatch({ type: "customTitle", payload: data?.current?.SHOP_NM });
    });
  };

  // 장비 추가
  const createDeviceSubmit = (): void => {
    let form = { DEVICE_LIST: deviceList };
    useAxios.post("/device/" + SHOP_SQ, form).then(({ data }) => {
      if (!data?.result) {
        return useAlert("error", "장비 추가에 실패하였습니다.");
      }

      setIsCreateDeviceModal(false);
      getShopData();
      useAlert(
        "success",
        `피부샵에 ${deviceList?.length}개의 장비를 추가하였습니다.`
      );
    });
  };

  // 장비 추가 유효성 검사
  const createDeviceValidate = (): void => {
    if (!deviceList?.length) return useAlert("warning", "장비를 추가해주세요.");

    let isDevicePass = true;
    deviceList?.forEach((item: any) => {
      let keys = Object.keys(item);
      keys?.forEach((key) => {
        if (!item[key]) {
          isDevicePass = false;
          useAlert("warning", "장비 정보를 모두 적어주세요.");
        }
      });
    });

    if (!isDevicePass) return;
    createDeviceSubmit();
  };

  useEffect(getShopData, [SHOP_SQ]);

  return (
    <>
      <Container
        isLoading={isLoading}
        style={{
          backgroundColor: shopData?.IS_DEL === 1 ? "#ddd" : "",
        }}
      >
        <InfoBoxWrap>
          <ShopInfoBox
            data={shopData}
            getShopData={getShopData}
            setIsDelModal={setIsDelModal}
          />
          <ManagerInfoBox
            data={shopData?.MNG ?? null}
            getShopData={getShopData}
          />
        </InfoBoxWrap>

        <SectionTitle>장비 정보</SectionTitle>
        <DeviceListHeader>
          <Tab
            active={activeDeviceTab}
            onChange={(e) => setActiveDeviceTab(e)}
            list={[
              { id: 1, name: "기본 정보" },
              { id: 2, name: "상태 정보" },
            ]}
          />
          <Button
            style={{ height: 32 }}
            onClick={() => setIsCreateDeviceModal(true)}
          >
            장비 추가
          </Button>
        </DeviceListHeader>
        {activeDeviceTab === 1 ? (
          <DeviceList
            currentList={shopData?.DEVICE}
            isHeader={false}
            isShopNameHide={true}
            isJustList={true}
          />
        ) : (
          <StateList
            currentList={shopData?.DEVICE}
            isHeader={false}
            isShopNameHide={true}
          />
        )}

        <SectionTitle>히스토리</SectionTitle>
        <HistoryList currentList={shopData?.HISTORY} isHeader={false} />

        {isDelModal && (
          <Modal
            title="피부샵 비활성화"
            size={500}
            buttons={[
              { id: 1, name: "비 활 성", color: "red", onClick: () => del() },
            ]}
            close={() => setIsDelModal(false)}
          >
            <ShopDelModal delInputRef={delInputRef} />
          </Modal>
        )}
      </Container>

      {isCreateDeviceModal && (
        <Modal
          title="피부샵 장비 추가"
          size={500}
          bgColor="#E7E7F1"
          buttons={[
            {
              id: 1,
              name: "장 비 추 가",
              onClick: () => createDeviceValidate(),
            },
          ]}
          close={() => setIsCreateDeviceModal(false)}
        >
          <CreateDeviceModal
            deviceList={deviceList}
            setDeviceList={setDeviceList}
          />
        </Modal>
      )}
    </>
  );
}

const Container = styled(_Container)`
  overflow: auto;
  min-height: calc(100% - 60px);
`;
const InfoBoxWrap = styled.section`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
const InfoBox = styled.section`
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  margin-bottom: 10px;

  & > section {
    flex: 1;
  }
`;
export const SectionTitle = styled.p`
  position: relative;
  font-size: 16px;
  font-weight: 500;
  color: #222222;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    display: block;
    flex: 1;
    height: 2px;
    background-color: #8b6ad3aa;
    margin-left: 10px;
  }
`;
const DeviceListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

// 공통
export const InfoBoxContainer = styled.section`
  padding-right: 10px;
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #222;
  margin-bottom: 14px;
`;
export const Title = styled.p`
  margin-right: 5px;
  padding-bottom: 1px;
`;
export const Editing = styled.span`
  display: flex;
  align-self: stretch;
  align-items: center;

  &::before {
    content: "(수정중)";
    color: #aaa;
    font-size: 13px;
    margin-right: 5px;
  }
`;
export const btnStyle = `
  margin-right: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 1px;
`;
export const EditBtn = styled(BsPencilSquare)`
  ${btnStyle}
  color: #aaaaaa;

  &:hover {
    color: #333333;
  }
`;
export const DelBtn = styled(BsLockFill)`
  ${btnStyle}
  padding: 2px;
  color: #f77373;

  &:hover {
    color: #ff0000;
  }
`;
export const OkBtn = styled(BsCheckLg)`
  ${btnStyle}
  color: #2bd319;

  &:hover {
    color: #1dba0b;
  }
`;
export const CancelBtn = styled(IoCloseSharp)`
  ${btnStyle}
  padding: 0;
  color: #aaaaaa;

  &:hover {
    color: #333333;
  }
`;
export const Contents = styled.article``;
export const Row = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555555;
  margin-bottom: 18px;
  overflow: hidden;
  position: relative;
`;
export const RowTitle = styled.div`
  width: 60px;
  color: #fff;
`;
export const RowContents = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  color: #fff;
`;
export const EditInput = styled(_Input)`
  width: calc(100% - 10px);
  height: 30px;
  color: #333333;
`;
