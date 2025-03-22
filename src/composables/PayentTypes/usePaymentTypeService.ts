import { PaymentTypeService } from "@/services/PaymentTypes/PaymenType.service";

const paymentService = new PaymentTypeService();

export const usePaymentTypeService = () => paymentService;
