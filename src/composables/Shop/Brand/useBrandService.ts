import { BrandService } from "@/services/Shops/Brands/Brand.service";
BrandService;

const brandService = new BrandService();

export const useBrandService = () => brandService;
