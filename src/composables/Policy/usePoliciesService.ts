import { PoliciesService } from "@/services/Policy/Policy.service";

const policieS = new PoliciesService()

export const usePolicyService = () => policieS
