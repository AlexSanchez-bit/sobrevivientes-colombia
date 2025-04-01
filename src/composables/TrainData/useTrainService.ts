import { BotService } from "@/services/BotTrain/BotTrain.service";
const service = new BotService();
export const useTrainService = () => service;
