import { TableService } from "./TableService";
import { type IGenericCrud } from "./IGenericCrud";
import type {
  PostgrestError,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

import { supabase } from "@/setup";

export class TableCrudService<T>
  extends TableService<T>
  implements
    IGenericCrud<
      T,
      T,
      Partial<T>,
      { message: string } | null,
      { message: string } | null,
      PostgrestError | null,
      PostgrestSingleResponse<T>
    >
{
  constructor(tablename: string, searchFields: string[]) {
    super(tablename, searchFields);
  }

  async getDetails(id: string | number) {
    return await supabase
      .from(this.tablename)
      .select("*")
      .eq("id", id)
      .single();
  }

  async create(data: T) {
    const { error } = await supabase.from(this.tablename).insert(data);
    return error;
  }
  async update(id: string | number, data: Partial<T>) {
    const { error } = await supabase
      .from(this.tablename)
      .update(data)
      .eq("id", id);

    return error;
  }

  async remove(id: string | number) {
    const { error } = await supabase.from(this.tablename).delete().eq("id", id);
    return error;
  }
}
