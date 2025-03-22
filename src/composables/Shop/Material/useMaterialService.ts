import { MaterialService } from "@/services/Shops/Material/Material.service";

const materialService = new MaterialService();

export const useMaterialService = () => materialService;
