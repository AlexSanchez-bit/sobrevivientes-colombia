
import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IAllies {
  id?: number;
  created_at?: Date;
  name: string;
  icon?: string;
  link?: string;
}

export class AllieService extends TableCrudService<IAllies> {
  constructor() {
    super("allies", ["*"]);
  }
}
