export const programName = "feagle";

export const errorMessage = {
  server: "server error",
  db: "database error",
  parameter: "parameter error",
};

export type MenuList = { id: number; path: string; name: string };
export const menuList: Array<MenuList> = [
  { id: 1, path: "/", name: "대시보드" },
  { id: 2, path: "/shop", name: "피부샵" },
  { id: 3, path: "/useDevice", name: "장비 사용 현황" },
  { id: 4, path: "/deviceState", name: "장비 상태 점검" },
  { id: 5, path: "/ware", name: "F/W, S/W 관리" },
  { id: 6, path: "/board", name: "자료 관리" },
  { id: 7, path: "/user", name: "사용자" },
];
