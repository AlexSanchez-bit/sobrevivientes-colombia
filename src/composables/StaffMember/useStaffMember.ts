import { StaffService } from "@/services/StaffMember/StaffMember.service";

const staffService = new StaffService();

export const useStaffService = () => staffService;
