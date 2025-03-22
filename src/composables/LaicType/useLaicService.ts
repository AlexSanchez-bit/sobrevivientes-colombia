import { LaicsService } from "@/services/Laics/Laic.service";

const laics = new LaicsService();

export const useLaicsService = () => laics;
