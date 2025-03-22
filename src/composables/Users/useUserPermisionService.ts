import { UserPermissionService } from "@/services/Users/UserPremission.service";

const userPermisionService = new UserPermissionService();

export const useUserPermisionService = () => userPermisionService;
