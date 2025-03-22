import { defineStore } from "pinia";
import { ref } from "vue";

export const useSplashStore = defineStore("splashScreen", () => {
  const active = ref(false);

  const last_timeout = ref<any>(null);
  const curr_tasks = ref(0);

  function enable() {
    curr_tasks.value += 1;
    active.value = true;
  }

  function disable() {
    if (last_timeout.value != null) {
      clearTimeout(last_timeout.value);
    }

    last_timeout.value = setTimeout(() => {
      curr_tasks.value -= 1;
      if (curr_tasks.value < 1) {
        active.value == false;
      }
    }, 300);
  }

  return { active, enable, disable };
});
