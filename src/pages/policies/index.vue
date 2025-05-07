<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-extrabold text-gray-800 mb-6">Políticas</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card para Protección -->
      <div class="bg-white shadow rounded-lg p-4 border border-gray-200 min-h-64">
        <h2 class="text-xl font-semibold mb-2">Política de Protección</h2>
        <div class="mb-4 min-h-48 flex items-center justify-center">
          <ProgressSpinner v-if="isUploading.protection" style="width: 40px; height: 40px" strokeWidth="5" />
          <iframe v-else-if="policy.protection" :src="policy.protection" class="w-full h-48 border rounded"></iframe>
          <span v-else>Nada Subido</span>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="$refs.protectionInput.click()" icon="pi pi-upload" label="Subir Nuevo" class="text-white"
            :disabled="isUploading.protection" v-permission="[Permission.WRITE_POLICY]" />
          <input ref="protectionInput" type="file" accept=".pdf,.docx" class="hidden"
            @change="handleUpload($event, 'protection')" />
        </div>
      </div>

      <!-- Card para Protocolo -->
      <div class="bg-white shadow rounded-lg p-4 border border-gray-200 min-h-64">
        <h2 class="text-xl font-semibold mb-2">Protocolo</h2>
        <div class="mb-4 min-h-48 flex items-center justify-center">
          <ProgressSpinner v-if="isUploading.protocol" style="width: 40px; height: 40px" strokeWidth="5" />
          <iframe v-else-if="policy.protocol" :src="policy.protocol" class="w-full h-48 border rounded"></iframe>
          <span v-else>Nada Subido</span>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="$refs.protocolInput.click()" icon="pi pi-upload" label="Subir Nuevo" class="text-white"
            :disabled="isUploading.protocol" v-permission="[Permission.WRITE_POLICY]" />
          <input ref="protocolInput" type="file" accept=".pdf,.docx" class="hidden"
            @change="handleUpload($event, 'protocol')" />
        </div>
      </div>

      <!-- Card para Decálogo -->
      <div class="bg-white shadow rounded-lg p-4 border border-gray-200 min-h-64">
        <h2 class="text-xl font-semibold mb-2">Decálogo</h2>
        <div class="mb-4 min-h-48 flex items-center justify-center">
          <ProgressSpinner v-if="isUploading.decalog" style="width: 40px; height: 40px" strokeWidth="5" />
          <iframe v-else-if="policy.decalog" :src="policy.decalog" class="w-full h-48 border rounded"></iframe>
          <span v-else>Nada Subido</span>
        </div>
        <div class="flex items-center gap-2">
          <Button @click="$refs.decalogInput.click()" icon="pi pi-upload" label="Subir Nuevo" class="text-white"
            :disabled="isUploading.decalog" v-permission="[Permission.WRITE_POLICY]" />
          <input ref="decalogInput" type="file" accept=".pdf,.docx" class="hidden"
            @change="handleUpload($event, 'decalog')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { supabase } from '@/setup'
import type { IPolicy } from '@/services/Policy/Policy.service'
import { usePolicyService } from '@/composables/Policy/usePoliciesService'
import uploadPublicFile from '@/composables/uploadPublicFile'
import { useToastStorage } from '@/stores/ToasterStorage'
import { Permission } from '@/utils/Permissions'

const service = usePolicyService()
const policy = ref<IPolicy>({})

const isUploading = ref({
  protection: false,
  protocol: false,
  decalog: false,
})

const { notify } = useToastStorage()

onMounted(async () => {
  const { data, error } = await service.getDetails(1)
  if (!error && data) {
    policy.value = data
  }
})

async function handleUpload(event: Event, field: 'protection' | 'protocol' | 'decalog') {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files.length) return
  const file = target.files[0]

  isUploading.value[field] = true

  const publicURL = await uploadPublicFile(file)

  if (!publicURL) {
    notify("error", "Error al subir archivo", "", 3000)
    isUploading.value[field] = false
    return
  }

  const updatePayload: Partial<IPolicy> = {}
  updatePayload[field] = publicURL
  const updateError = await service.update(1, updatePayload)

  if (updateError) {
    console.error(updateError)
  } else {
    policy.value[field] = publicURL
  }

  isUploading.value[field] = false
  target.value = ''
}
</script>

<style scoped>
iframe {
  min-height: 200px;
}
</style>
