import { TableCrudService } from "@/utils/service/TableCrudService";

export interface ILaic {
  id?: number;
  created_at?: Date;
  name: string;
  description?: string;
  image?: string;
}

export class LaicsService extends TableCrudService<ILaic> {
  constructor() {
    super("laic_type", ["*"]);
  }
}
