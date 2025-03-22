<template>
  <div class="grid grid-cols-4 gap-3 px-4">
    <div
      class="relative flex rounded-xl justify-center items-center w-full h-full border-dashed border-2 min-h-[250px] cursor-pointer border-gray-300"
    >
      <i class="pi pi-plus"></i>

      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onImageSelect"
      />
    </div>
    <div
      v-for="(image, index) in images"
      :key="index"
      class="relative shadow-sm shadow-zinc-50 parent-hide"
    >
      <slot :src="image">
        <Image :src="image" alt="Image" height="250" preview />
      </slot>
      <Button
        icon="pi pi-trash"
        class="absolute top-2 right-2 child-hover-hide"
        severity="danger"
        variant="text"
        rounded
        @click="images.splice(index, 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Image from "primevue/image";
import { ref } from "vue";
import uploadPublicFile from "@/composables/uploadPublicFile";
import Button from "primevue/button";
const images = defineModel<string[]>("images");
if (!images.value) {
  images.value = [];
}
const toUploadImages = ref<[File, number][]>([]);

function onImageSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    toUploadImages.value.push([file, images.value.length]);
    const reader = new FileReader();
    reader.onload = () => {
      images.value.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}

async function uploadImages() {
  const promises = [];
  const indexes = [];

  const original_images = images.value;

  toUploadImages.value.forEach(([file, index]) => {
    indexes.push(index);
    const promise = async () => {
      const url = await uploadPublicFile(file);

      return [url, index];
    };
    promises.push(promise());
  });

  const ret = await Promise.all(promises);
  return original_images.map((image, index) => {
    if (indexes.includes(index)) {
      return ret.find(([_url, ind]) => ind == index)[0];
    }
    return image;
  });
}

defineExpose({
  uploadImages,
});
</script>

<style scoped>
.child-hover-hide {
  display: none;
}

.parent-hide:hover .child-hover-hide {
  display: block;
}
</style>
