import { OrderService } from "@/services/Order/Order.service";

const orderService = new OrderService();

export const useOrderService = () => orderService;
