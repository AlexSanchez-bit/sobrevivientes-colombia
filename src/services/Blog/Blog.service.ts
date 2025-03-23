import { TableCrudService } from "@/utils/service/TableCrudService";

export interface IBlogEntrie {
  id?: number;
  created_at?: Date;
  user_id: string;
  image?: string;
  text?: string;
  title?: string;
}

export class BlogEntrieService extends TableCrudService<IBlogEntrie> {
  constructor() {
    super("blog_entrie", ["*,user!inner(name,id)"]);
  }
}
