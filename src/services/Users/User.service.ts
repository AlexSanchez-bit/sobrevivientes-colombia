import { TableService } from "@/utils/service/TableService";
import { supabase } from "@/setup";
import { TableCrudService } from "@/utils/service/TableCrudService";

export class UserService extends TableCrudService<any> {
  constructor() {
    super("user", ["id,email,profile_picture", "name", "created_at"]);
  }

  async getUserData(id: string) {
    const { data, error } = await supabase
      .from(this.tablename)
      .select()
      .eq("id", id)
      .single();
    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return { data, error };
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    profile_picture: string,
  ) {
    const { data, error } = await supabase.functions.invoke("create_user", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
        profile_picture,
      }),
    });

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }
    return data;
  }

  async updateUser(
    id: string,
    name: string,
    email: string,
    profile_picture?: string,
  ) {
    const { error } = await supabase
      .from(this.tablename)
      .update({ name, email, profile_picture })
      .eq("id", id);

    if (error) {
      this.notify.notify("error", "", error.message, 3000);
    }

    return error;
  }

  async remove(id: string | number) {
    const _resp = await supabase.functions.invoke("remove_user", {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
      }),
    });

    return null;
  }
}
