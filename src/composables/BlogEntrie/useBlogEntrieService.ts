import { BlogEntrieService } from "@/services/Blog/Blog.service";

const blogService = new BlogEntrieService();

export const useBlogEntrieService = () => blogService;
