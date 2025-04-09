<template>
  <div class="relative">
    <div class="[grid-area:main] w-full box-border">
      <div ref="prevLoad" />
      <div
        v-show="!is_loading || current_page > 1"
        class="min-h-screen"
        :class="displayClass ?? 'flex flex-col gap-2'"
      >
        <slot
          v-for="(item, index) in items"
          :key="index"
          :item="item"
          name="item"
        >
          {{ item }}
        </slot>
        <div
          v-if="items.length == 0"
          class="text-center text-gray-300 flex items-center justify-center h-36 w-full"
        >
          <slot name="empty">
            <h6 class="w-full">{{ $t("nothing_to_show") }}</h6>
          </slot>
        </div>
      </div>

      <div
        v-if="is_loading"
        class="min-h-screen"
        :class="displayClass ?? 'flex flex-col gap-2'"
      >
        <slot v-for="i in 10" :key="i" name="skeletons">
          <Skeleton class="w-full !h-12" />
        </slot>
      </div>

      <div ref="nextLoad" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from "primevue/skeleton";
import { onMounted, ref, toRefs } from "vue";
import { useToastStorage } from "@/stores/ToasterStorage";
import { Pagination } from "@/utils/entities/Pagination";
import type { TableService } from "@/utils/service/TableService";

const props = defineProps<{
  service: {
    getAllTotalCount: (
      filters: any[],
      pagination: any,
      orders: any[],
    ) => Promise<any>;
  };
  filter?: any[];
  order?: any[];
  displayClass?: string;
}>();

const { displayClass } = toRefs(props);
const filter = ref(props.filter);
const order = ref(props.order);

const prevLoad = ref();
const nextLoad = ref();

const pages_count = ref(10);

const items = ref<any[]>([]);
const current_page = ref<number>(0);
const all_pages = ref<number>(0);

const is_loading = ref<boolean>(false);

const toast = useToastStorage();

const handlePrevIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (current_page.value - 2 > 1) {
        current_page.value -= 3;
        items.value = [];
        loadData();
      }
    }
  });
};
const handlePostIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (current_page.value < all_pages.value) {
        current_page.value += 1;
        loadData();
      }
    }
  });
};

onMounted(() => {
  loadData();
  const observerPrev = new IntersectionObserver(handlePrevIntersection, {
    root: null, // Usa el viewport completo como área de visualización
    threshold: 0.5, // Ejecuta el callback cuando el 10% del elemento esté en pantalla
  });
  const observerPost = new IntersectionObserver(handlePostIntersection, {
    root: null, // Usa el viewport completo como área de visualización
    threshold: 0.5, // Ejecuta el callback cuando el 10% del elemento esté en pantalla
  });

  // Comenzamos a observar el elemento
  if (prevLoad.value) {
    observerPrev.observe(prevLoad.value);
  }
  if (nextLoad.value) {
    observerPost.observe(nextLoad.value);
  }
});

const { getAllTotalCount } = props.service;

async function loadData() {
  is_loading.value = true;

  const { totalCount, data } = await getAllTotalCount(
    filter.value ?? [],
    new Pagination(current_page.value, pages_count.value),
    order.value ?? [],
  );

  is_loading.value = false;

  console.log(data);
  if (data) {
    items.value = [...items.value.slice(-20), ...data];
    all_pages.value = Math.floor(totalCount / pages_count.value);
  } else {
    toast.notify("error", "", "Ocurrio un error", 4000);
  }
}

const apply_filters = (nfilter?: any) => {
  current_page.value = 0;
  items.value = [];
  filter.value = nfilter ?? filter.value;
  loadData();
};

defineExpose({
  apply_filters,
  items,
});
</script>

<style scoped>
.main-container-- {
  display: grid;
  grid-template-areas: " main main main main ";
  min-height: 100vh;
}
</style>
