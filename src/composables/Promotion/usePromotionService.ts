import { PromotionService } from "@/services/Promotion/Promotion.service";

const promotionS = new PromotionService();
export const usePromotionService = () => promotionS;
