import { UserService } from "@/services/Users/User.service";

const userService = new UserService();

export function useUserService() {
  return { userService };
}
