import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";

export interface StaffMember {
  id?: number;
  created_at?: Date;
  name: string;
  picture?: string;
  profile_link?: string;
  speciality?: string;
}

export class StaffService extends TableCrudService<StaffMember> {
  constructor() {
    super("staff_member", ["*"]);
  }
}
