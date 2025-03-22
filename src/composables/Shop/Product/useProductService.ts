import { ProductsService } from "@/services/Shops/Products/Products.service";

const productService = new ProductsService();

export const useProductService = () => productService;
