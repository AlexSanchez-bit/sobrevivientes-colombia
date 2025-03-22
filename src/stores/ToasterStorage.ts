import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useToastStorage = defineStore('toastStorage', {
  state: () => ({ // variables que definen el estado
    toaster: reactive({ toaster: {} as any })
  }),
  getters: {
  },
  actions: {
    addtoaster (toast: any) {
      this.toaster.toaster = toast
    },
    notify (severity: string, header: string, message: string, lifeTime: number) {
      this.toaster.toaster.add({ severity, summary: header, detail: message, life: lifeTime })
    }
  }
})
