<template>
  <Dialog
    v-model:visible="passchange"
    modal
    header="Cambiar Contraseña"
    :style="{ width: '25rem' }"
  >
  </Dialog>
  <div class="flex flex-row w-full h-full max-w-full">
    <!-- Sidebar -->
    <div
      ref="slideovermenu"
      :class="{
        closed: !visible && !static_pane,
        '!w-72 p-3 pl-0': static_pane || visible,
        'slide-bar': !static_pane,
      }"
      class="hover:w-72 drop-shadow-md top-0 slide-bar-container z-40 left-0 md:w-16 md:pl-3 md:py-3 pb-4 pr-0 overflow-y-auto bg-darkblue text-wood"
    >
      <div class="flex flex-col h-full">
        <div
          class="w-full flex flex-row justify-end pr-4"
          v-show="visible || static_pane"
        >
          <div
            class="hidden md:flex text-wood flex-col place-items-center transition-transform"
            @click="toggle_static_pane"
            :class="static_pane ? [] : ['rotate-45']"
          >
            <div class="w-2 h-1 bg-wood rounded-b-full -mb-0.5" />
            <div class="rounded-full w-1 h-2 bg-wood" />
            <div class="w-2 h-1 bg-wood rounded-t-full -mt-0.5" />
            <div class="w-0.5 h-2 bg-wood" />
          </div>
        </div>
        <section
          :class="{ 'slide-header-visible': visible || static_pane }"
          class="flex flex-row slide-header justify-center items-center pr-3"
        >
          <picture
            class="logo-button rounded-full overflow-hidden bg-white"
            :class="{ 'logo-button-active': static_pane }"
          >
            <img
              @click="toggle_panel(false)"
              class="cursor-pointer w-full h-full"
              src="/logo/logo.png"
              alt="logo"
            />
          </picture>
        </section>

        <div class="divide-y-2 divide-gray-50 divide-dashed mr-3">
          <section
            class="flex flex-col gap-1 slide-text mt-12 mb-12"
            :class="{ 'slide-text-active': static_pane }"
          >
            <h3 class="text-lg truncate text-wood text-center">
              {{ authService.userData?.name }}
              {{ authService.userData?.last_name }}
            </h3>
            <h4 class="text-md truncate text-wood text-center">
              {{ authService.userData?.email }}
            </h4>
          </section>
          <StaticMenu
            class="slide-text"
            :menuItems="groups"
            :class="{ 'slide-text-active': static_pane }"
          />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-grow min-h-screen overflow-auto">
      <div
        class="flex flex-row mb-3 py-2 border-gray-200 border rounded-lg gap-4 justify-between px-2"
      >
        <Button
          :icon="!static_pane ? 'pi pi-chevron-right' : ' pi pi-chevron-left'"
          @click="toggle_static_pane"
          class="block md:hidden z-50"
          severity="secondary"
          aria-label="Bookmark"
        />
        <span></span>
        <div class="flex flex-row gap-0.5">
          <Menubar class="border-none p-0" breakpoint="100px" :model="items">
            <template #start>
              <Avatar
                :image="authService.userData?.profile_picture"
                size="normal"
              />
            </template>
          </Menubar>
        </div>
      </div>

      <div class="flex-grow px-3 overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "primevue/button";
import LanguageSelector from "../../LanguageSelector.vue";
import StaticMenu from "./StaticMenu.vue";
import { MenuList } from "../entities/MenuList";
import { ref, provide, computed, onMounted, onUnmounted } from "vue";
import Menubar from "primevue/menubar";
import Dialog from "primevue/dialog";
import Avatar from "primevue/avatar";

const groups = MenuList;

const visible = ref(false);

import { useAuthStore } from "@/stores/AuthStore";

const authService = useAuthStore();
const passchange = ref(false);
const static_pane = ref(false);
const mobile_panel_back = ref(false);

const toggle_static_pane = () => {
  static_pane.value = !static_pane.value;
};

const toggle_panel = (activation_param: boolean) => {
  if (visible.value == activation_param && !static_pane.value) {
    visible.value = !visible.value;
  }
};

const userName = computed<string>(() => {
  return `${authService.userData?.name} ${authService.userData?.last_name ?? ""}`;
});

const { t } = useI18n();

const items = ref([
  {
    label: userName,
    icon: "",
    items: [
      {
        label: computed(() => t("logout")),
        icon: "pi pi-sign-out",
        command: () => {
          authService.logout();
        },
      },
    ],
  },
]);

const activePanel = computed<boolean>(() => {
  return visible.value || static_pane.value;
});

provide("activatedPanel", activePanel);

onMounted(async () => {
  window.addEventListener("resize", updateScreenSize);
  updateScreenSize();
});

const isLargeScreen = ref(window.innerWidth >= 1024); // Cambia el valor según el tamaño deseado

const slideovermenu = ref();

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024;
  const enterListenner = () => toggle_panel(false);
  const leaveListenner = () => toggle_panel(true);
  if (!isLargeScreen.value) {
    slideovermenu.value?.removeEventListener("mouseenter", enterListenner);
    slideovermenu.value?.removeEventListener("mouseleave", leaveListenner);
  } else {
    slideovermenu.value?.addEventListener("mouseenter", enterListenner);

    slideovermenu.value?.addEventListener("mouseleave", leaveListenner);
  }
};

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<style scoped>
.slide-bar-container {
  position: sticky;
  flex-shrink: 0;
  flex: grow 1;
  height: 100dvh;
  top: 0;
  transition: all 0.1s ease-out 0.05s;
}

:deep .p-menubar ul {
  float: left;
  /* Ajusta la posición del menú a la izquierda */
  margin-right: 20px;
}

.slide-text {
  width: 0;
  transition: width 0.3s ease-out;
}

.slide-button {
  display: none;
}

.slide-bar:hover .slide-button {
  display: block;
}

.slide-button-active {
  display: block;
}

.slide-header {
  transition: all 0.3s ease-out;
}

.slide-bar:hover .slide-header {
  justify-content: between;
  gap: 30px;
}

.slide-header-visible {
  justify-content: between;
  gap: 30px;
}

.logo-button {
  height: 50px;
  width: 50px;
}
.slide-bar:hover .slide-header {
  padding-right: 29px;
}
.slide-bar:hover .logo-button {
  width: 9rem;
  height: 9rem;
  transition: all 0.3s ease-out;
}

.logo-button-active {
  width: 9rem;
  height: 9rem;
  transition: all 0.3s ease-out;
}

.slide-bar:hover .slide-text {
  width: auto;
}

.slide-text-active {
  width: auto;
}

.slide-button-visible {
  width: 25px;
  height: 25px;
  transition: all 0.3s ease-out;
}

.slide-bar:hover {
  width: 17rem;
}

.slide-bar:hover .oppened {
  width: 17rem;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.slide-bar-container::-webkit-scrollbar {
  display: none;
}

/* Responsive fixes */
@media (max-width: 768px) {
  .closed {
    width: 0;
    opacity: 0;
    overflow: hidden;
    z-index: -100;
  }

  .slide-bar:hover {
    width: auto;
  }

  .slide-bar:hover .oppened {
    width: auto;
  }

  .slide-bar-container {
    width: 100%;
    position: fixed;
    max-width: 80%;
  }

  .flex-grow {
    overflow-y: auto;
  }
}
</style>
