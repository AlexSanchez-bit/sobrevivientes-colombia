import { CategoryService } from "@/services/Shops/Categories/Category.service";
import { ConcernService } from "@/services/Shops/Concerns/Concern.service";

const concernService = new ConcernService();

export const useConcernService = () => concernService;
