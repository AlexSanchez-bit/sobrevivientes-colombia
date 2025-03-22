<template>
  <div class="flex flex-col gap-4">
    <section
      v-for="menu of menuItems"
      :key="menu.icon"
      v-permission="menu.permission"
    >
      <span
        v-if="menu.type == 'Normal'"
        :class="{ 'menu-row-activated': !activated }"
      >
        <router-link
          :to="menu.router_direction!"
          class="cursor-pointer transition-all duration-300 truncate ps-3 p-2 flex flex-row items-center bg-darkblue gap-4 hover:bg-gradient-to-r from-wood via-wood to-darkblue rounded-l-full hover:text-grass"
        >
          <i v-bind:class="[menu.icon, 'text-center']"></i>
          <p
            v-bind:class="{ 'main-menu-text-activated': activated }"
            class="truncate"
          >
            {{ $t(menu.name) }}
          </p>
        </router-link>
      </span>

      <section v-else>
        <PanelMenu :model="items" class=""> </PanelMenu>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toRefs, inject, computed } from "vue";
// import { useRouter } from 'vue-router'
import { MenuListItem } from "../entities/MenuListItem";
import PanelMenu from "primevue/panelmenu";
import { useRouter } from "vue-router";
const props = defineProps<{
  menuItems: MenuListItem[] | undefined;
}>();

const activated = inject("activatedPanel");
const router = useRouter();

const { menuItems } = toRefs(props);

const mapIntoItem = (items: MenuListItem[] | undefined | null): any[] => {
  if (!items || items == null) {
    return [];
  }
  return items.map((item) => {
    return {
      label: item.name,
      icon: item.icon,
      items: mapIntoItem(item.childrenMenu),
      // url: item.router_direction
      ...(item.router_direction
        ? { command: () => router.push(item.router_direction!) }
        : {}),
    };
  });
};

const items = computed({
  get(): any[] {
    return mapIntoItem(menuItems.value);
  },
  set(_newVal) {},
});

// const router = useRouter()

// const redirect = (router_direction: string | undefined): void => {
//   if (!router_direction || router_direction == '') {
//     return
//   }
//   router.push(router_direction);

// }
</script>

<style scoped>
:deep .p-panelmenu-panel {
  border: none;
}

:deep .p-panelmenu-header-content {
  background: #0b132b;
  color: lightgray;
}

:deep .p-menuitem-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #9ca3af;
}

:deep .p-menuitem-content {
  background: #0b132b;
}

:deep .p-panelmenu-header-action {
  background: #0b132b;
  padding-left: 0px;
  color: lightgray;
  text-wrap: truncate;
}

:deep .p-menuitem-link:hover {
  border: solid 1px linear-gradient(to right, #e5b053, #0b132b);
  border-top-left-radius: 0.5em 1em;
  border-bottom-left-radius: 0.5em 1em;
  background: linear-gradient(to right, #e5b053, #0b132b);
}

:deep .p-panelmenu-content {
  padding-left: 0px;
  background: none;
}

.main-menu-text {
  width: 0;
  transition: width 0.3s ease-out;
}

.static-menu {
  background: #0b132b;
  color: lightgray;
}

.main-menu-text-activated {
  width: auto;
}

.menu-row {
  transition: background 1s ease;
  border-top-left-radius: 0.5em 1em;
  border-bottom-left-radius: 0.5em 1em;
}

.menu-row:hover {
  border-top-left-radius: 0.5em 1em;
  border-bottom-left-radius: 0.5em 1em;
  background: linear-gradient(to right, #e5b053, #0b132b);
}

.menu-row:hover i {
  color: #0b132b;
}

.menu-row:hover p {
  color: #0b132b;
}

.menu-row-activated {
  justify-content: center;
}
</style>
