import { ReferalService } from "@/services/Referal/Referal.service";

const referal = new ReferalService()


export const useReferalService = () => referal
