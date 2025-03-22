import { GeneralConfigsService } from "@/services/General-Configs/GeneralConfigs.service";

const generalCService = new GeneralConfigsService();

export const useGeneralConfigService = () => generalCService;
