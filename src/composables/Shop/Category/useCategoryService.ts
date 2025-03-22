import { CategoryService } from "@/services/Shops/Categories/Category.service";

const categoryService = new CategoryService();

export const useCategoryService = () => categoryService;
