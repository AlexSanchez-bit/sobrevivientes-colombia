import { TableCrudService } from "@/utils/service/TableCrudService";

export enum TestimonyStatus {
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}
export interface ITestimony {
  id?: number;
  created_at: Date | string;
  name: string;
  laic_involved?: number;
  location?: any;
  status: TestimonyStatus;
  text: string;
  gender?: Gender;
  age?: number;
}

export class TestimonyService extends TableCrudService<ITestimony> {
  constructor() {
    super("testimony", ["*,laic_:laic_type(*)"]);
  }
}
