<template>
  <section v-for="menu in menuItems" class="truncate mb-4" :key="menu.type">
    <p
      v-bind:class="{ 'main-menu-text-activated': activated }"
      class="mt-4 mb-2 main-menu-text truncate text-gray-200"
    >
      {{ $t(menu.name) }}
    </p>
    <div class="flex flex-col gap-3">
      <NormalMenu :menuItems="menu.childrenMenu" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { MenuListItem } from "../entities/MenuListItem";
import NormalMenu from "./NormalMenu.vue";
import { toRefs, inject } from "vue";
const props = defineProps<{
  menuItems: MenuListItem[] | undefined;
}>();

const activated = inject("activatedPanel");

const { menuItems } = toRefs(props);
</script>

<style scoped>
.main-menu-text {
  width: 0;
  transition: width 0.3s ease-out;
}

.main-menu-text-activated {
  width: auto;
}
</style>
