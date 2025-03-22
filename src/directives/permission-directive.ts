// directives/permission.js
import { useAuthStore } from "@/stores/AuthStore";

export default {
  mounted(el, binding) {
    if (!binding.value) {
      return;
    }
    const authStore = useAuthStore();
    const requiredPermissions = binding.value;
    const userPermissions = authStore.userData?.user_permissions || [];

    const hasPermissions = binding.modifiers.any
      ? requiredPermissions.some((p) => userPermissions.includes(p))
      : requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasPermissions) {
      el.style.display = "none";
    } else {
      el.style.display = "block";
    }
  },
  updated(el, binding) {
    if (!binding.value) {
      return;
    }
    const authStore = useAuthStore();
    const requiredPermissions = binding.value;
    const userPermissions = authStore.userData?.user_permissions || [];

    const hasPermissions = binding.modifiers.any
      ? requiredPermissions.some((p) => userPermissions.includes(p))
      : requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasPermissions) {
      el.style.display = "none";
    } else {
      el.style.display = "block";
    }
  },
};
