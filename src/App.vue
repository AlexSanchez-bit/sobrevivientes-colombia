<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useToastStorage } from "./stores/ToasterStorage";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "./stores/AuthStore";
import { supabase } from "./setup";
import { onMounted } from "vue";
const toastStorage = useToastStorage();
const toast = useToast();
toastStorage.addtoaster(toast);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const resp = await supabase.auth.refreshSession();
  if (resp.error) {
    router.push("/auth/login");
  } else {
    const { data, error } = await supabase
      .from("user")
      .select("*,user_permissions(permission(name))")
      .eq("id", resp.data.user.id)
      .single();
    if (!error) {
      data.user_permissions = data.user_permissions.map(
        (perm) => perm.permission.name,
      );

      authStore.autenticate(data);
    }
  }
});
</script>

<template>
  <RouterView />
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>
