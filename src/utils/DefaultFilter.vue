<template>
  <div>
    <!-- Dropdown que actúa como botón para desplegar el input -->
    <Button
      icon="pi pi-chevron-down"
      @click="toggleDropdown"
      severity="secondary"
      aria-label="Bookmark"
    />

    <!-- Input desplegable -->
    <div v-show="dropdown" class="absolute z-50">
      <div v-if="dataType === 'numeric'">
        <!-- Aquí puedes agregar tu componente o lógica para números -->
        <input
          class="px-2 py-1 shadow-lg rounded-md border-solid"
          type="number"
          autofocus
          ref="inputField"
          v-model="value"
          @input="onInput"
          @blur="dropdown = false"
        />
      </div>
      <div v-else>
        <!-- Este es el caso por defecto para cualquier otro tipo -->
        <input
          class="px-2 py-1 shadow-lg rounded-md border-solid"
          type="text"
          autofocus
          v-focus
          ref="inputField"
          v-model="value"
          @input="onInput"
          @blur="dropdown = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineModel, toRefs, type Ref } from "vue";
import Button from "primevue/button";
import { nextTick } from "vue";

// Definición de props
const props = defineProps<{
  dataType: any;
  onInput: (value: any) => any;
}>();

const { dataType } = toRefs(props);

const value = defineModel<any>();
const inputField: Ref<any> = ref(null);

// Estado local para el dropdown
const dropdown = ref(false);

// Método para alternar el estado del dropdown
const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
  nextTick(() => {
    inputField.value.focus();
  });
};

// Exponer el estado y métodos al template
defineExpose({
  dropdown,
  toggleDropdown,
});
</script>
