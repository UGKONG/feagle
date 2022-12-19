import { MasterAuth, SetState } from "../../../types";

export type HeaderList = Array<string>;
export type FilterList = Array<{ id: number; name: string }>;
export type Active = { sort: number; dir: "ASC" | "DESC"; filter: string };
export type Props = {
  authList: MasterAuth[];
  isHeader?: boolean;
  setJoinListView: SetState<boolean>;
};
