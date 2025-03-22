import { type GroupMenuType } from "./GroupMenu";

export class MenuListItem {
  public name!: string;
  public icon!: string;
  public router_direction?: string;
  public type!: GroupMenuType;
  public childrenMenu?: MenuListItem[] = [];
  public permission?: string[];
}
