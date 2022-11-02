export type not = null | undefined;
export type a = any;
export type s = string;
export type n = number;
export type b = boolean;
export type v = void;
export type sn = s | number;
export type P<T = v> = Promise<T>;
export type OrNull<T> = T | null;

// 공통코드 테이블
export interface CommonCode {
  COMM_SQ: n;
  COMM_GRP: n;
  COMM_CODE: n;
  COMM_NM: s;
  COMM_DESC: s;
}

// 샵 테이블
export interface Shop {
  SHOP_SQ: n;
  SHOP_NM: s;
  SHOP_NUM: s;
  SHOP_ADD: s;
  SHOP_MOD_DT: s;
  SHOP_CRT_DT: s;
}

// 장비 모델 테이블
export interface DeviceModel {
  MDL_SQ: n;
  MDL_NM: s;
  MDL_EN_NM: s;
  MDL_DESC: s;
  MDL_MOD_DT: s;
  MDL_CRT_DT: s;
}

// 장비 테이블
export interface Device {
  DEVICE_SQ: n;
  MDL_SQ: n;
  SHOP_SQ: n;
  DEVICE_SN: s;
  DEVICE_NM: s;
  DEVICE_SW_VN: s;
  DEVICE_FW_VN: s;
  DEVICE_BUY_DT: s;
  DEVICE_INSTL_DT: s;
  DEVICE_LAST_DT: s;
  DEVICE_MOD_DT: s;
  DEVICE_CRT_DT: s;
}

// 마스터 테이블 (피글 관계자들)
export interface Master {
  MST_SQ: n;
  SHOP_SQ: n;
  MST_NM: s;
  MST_NUM: s;
  AUTH_SQ: n;
  IS_DEL: n;
  MST_MOD_DT: s;
  MST_CRT_DT: s;
}

// 마스터 권한 유형 테이블
export interface MasterAuth {
  MST_SQ: n;
  SHOP_SQ: n;
  MST_NM: s;
  MST_NUM: s;
  AUTH_SQ: n;
  IS_DEL: n;
  MST_MOD_DT: s;
  MST_CRT_DT: s;
}

// 매니저 테이블 (피부샵 관계자들)
export interface Manager {
  MNG_SQ: n;
  SHOP_SQ: n;
  MNG_NM: s;
  MNG_NUM: s;
  OS: s;
  UUID: s;
  IS_DEL: n;
  MNG_MOD_DT: s;
  MNG_CRT_DT: s;
}

// 회원 테이블 (피부샵의 회원들)
export interface Manager {
  MEM_SQ: n;
  SHOP_SQ: n;
  MEM_NM: s;
  MEM_NUM: s;
  OS: s;
  UUID: s;
  IS_DEL: n;
  MEM_MOD_DT: s;
  MEM_CRT_DT: s;
}

// 장비 사용 테이블 (장비 사용 내역 / <시작, 종료>)
export interface UseDevice {
  UD_SQ: n;
  DEVICE_SQ: n;
  UD_START: s;
  UD_END: s;
  UD_MOD_DT: s;
  UD_CRT_DT: s;
}

// 장비 데이터 테이블 (장비 상태 내역)
export interface UseDeviceData {
  UDD_SQ: n;
  DEVICE_SQ: n;
  UDD_TP: n;
  UDD_VAL: n;
  UDD_CRT_DT: s;
}

// 가스 주문 테이블
export interface GasReq {
  GR_SQ: n;
  SHOP_SQ: n;
  GR_STT: n;
  GR_DT: s;
  GR_MOD_DT: s;
  GR_CRT_DT: s;
}

// 자료 & F/W & S/W 게시판 테이블
export interface Post {
  POST_SQ: n;
  POST_TP: n;
  MDL_SQ: n;
  BUILD_VN: s;
  POST_TTL: s;
  POST_CN: s;
  MST_SQ: n;
  BUILD_DT: s;
  POST_MOD_DT: s;
  POST_CRT_DT: s;
}

// 첨부파일 테이블
export interface File {
  FILE_SQ: n;
  POST_SQ: n;
  FILE_PATH: s;
  FILE_HASH_NM: s;
  FILE_NM: s;
  FILE_SZ: n;
  FILE_TP: s;
  FILE_MOD_DT: s;
  FILE_CRT_DT: s;
}

// 다운로드 로그 테이블
export interface GetLog {
  GET_SQ: n;
  GET_TP: n;
  FILE_SQ: n;
  ACT_SQ: n;
  GET_CRT_DT: s;
}

// 장비 버전 로그
export interface VersionLog {
  VL_SQ: n;
  DEVICE_SQ: n;
  VL_SW: n;
  VL_FW: n;
  VL_CRT_DT: s;
}

// 로그 테이블
export interface Log {
  LOG_SQ: n;
  LOG_TP: n;
  LOG_TXT: s;
  LOG_CRT_DT: s;
}
