import { TestimonyService } from "@/services/Testimony/Testimony.service";

const testimonies = new TestimonyService();

export const useTestimonyService = () => testimonies;
