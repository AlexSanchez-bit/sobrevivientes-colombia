
import { TableCrudService } from "@/utils/service/TableCrudService";

export enum ReferalStatus {
  CREATED = "CREATED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface IReferal {
  id?: number;
  created_at: Date | string;
  name?: string;
  email?: string;
  status: ReferalStatus;
  phone_number: string;
  description: string;
}

export class ReferalService extends TableCrudService<IReferal> {
  constructor() {
    super("referals", ["*"]);
  }
}
