import { TableCrudService } from "@/utils/service/TableCrudService";

export enum TestimonyStatus {
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface ITestimony {
  id?: number;
  created_at: Date;
  name: string;
  laic_involved?: number;
  location?: any;
  status: TestimonyStatus;
}

export class TestimonyService extends TableCrudService<ITestimony> {
  constructor() {
    super("testimony", ["*"]);
  }
}
