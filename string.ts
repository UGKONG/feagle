// 프로그램명
export const programName = "feagle";

// API 에러 메시지
export const errorMessage = {
  server: "server error",
  db: "database error",
  parameter: "parameter error",
};

// 메뉴 리스트
export type MenuList = { id: number; path: string; name: string };
export const menuList: Array<MenuList> = [
  { id: 1, path: "/", name: "대시보드" },
  { id: 2, path: "/shop", name: "피부샵" },
  { id: 3, path: "/model", name: "장비 모델" },
  { id: 4, path: "/device", name: "장비 사용 현황" },
  { id: 5, path: "/state", name: "장비 상태 점검" },
  { id: 6, path: "/ware", name: "F/W, S/W 관리" },
  { id: 7, path: "/board", name: "자료 관리" },
  { id: 8, path: "/user", name: "사용자" },
];

// 파일 업로드 경로
export const uploadDir = `${__dirname}/upload`;
