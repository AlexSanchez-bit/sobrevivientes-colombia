import { supabase } from "@/setup";
import type { IGenericList } from "@/utils/service/IGenericCrud";

export class UserPermissionService implements IGenericList<any> {
  async getAll(page: number, limit: number, filter: any): Promise<any> {
    return await supabase.from("permission").select("*");
  }

  async getUserPermissions(id: string) {
    return await supabase
      .from("user_permissions")
      .select("*,permission(id,name)")
      .eq("user_id", id);
  }

  async saveUserPermissions(
    id: string,
    newPermissions: number[],
    oldPermissions: number[],
  ) {
    const tosavePermissions = newPermissions.filter(
      (permision_id: number) => !oldPermissions.includes(permision_id),
    );
    const toremovePermissions = oldPermissions.filter(
      (permision_id: number) => !newPermissions.includes(permision_id),
    );

    const promises = [];

    tosavePermissions.forEach((permission_id: number) => {
      const tmp_call = async () => {
        const ret = await supabase
          .from("user_permissions")
          .insert({ user_id: id, permission_id });
        return ret;
      };
      promises.push(tmp_call());
    });

    toremovePermissions.forEach((permission_id: number) => {
      const tmp_call = async () => {
        return await supabase
          .from("user_permissions")
          .delete()
          .eq("user_id", id)
          .eq("permission_id", permission_id);
      };
      promises.push(tmp_call());
    });

    return await Promise.all(promises);
  }
}
