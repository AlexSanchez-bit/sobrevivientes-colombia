
import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IPolicy {
  id?: number;
  created_at?: Date;
  protection?: string;
  protocol?: string;
  decalog?: string
}

export class PoliciesService extends TableCrudService<IPolicy> {
  constructor() {
    super("policies", ["*"]);
  }
}
