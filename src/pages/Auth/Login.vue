<template>
  <div class="w-full  bg-cover relative h-screen flex justify-center items-center">
    <div class="w-full h-full absolute top-0 left-0 z-0 bg-darkblue"></div>

<ProgressBar mode="indeterminate" v-if="loading" class="z-10 w-full top-0 absolute" style="height: 6px"></ProgressBar>

    <form onsubmit:prevent=""
    class="bg-white font-albra-serif-regular z-10 px-10 py-6 pb-10 rounded-lg flex flex-col gap-6 items-center"
      >
      <img src="/logo/logo.png" class="w-32 " alt="">
      
    <div class="card flex justify-content-center w-full">

              <FloatLabel class="w-full">
            <InputText @input="email_touched=true" :invalid="email_touched&&!email_valid" id="username" v-model="email" class="w-full" />
            <label for="username" class="font-albra-serif-bold">{{$t('email')}}</label>
        </FloatLabel>

    </div>
        <div class="card flex justify-content-center flex-1 p-0">
                        <FloatLabel class="w-full">
<Password id="password" @input="password_touched=true" :invalid="password_touched&&!password_valid" v-model="password" :feedback="false" class="flex-1" toggleMask/>
            <label for="password" class="font-albra-serif-bold">{{$t('password')}}</label>
        </FloatLabel>

        </div>
        <Button :disabled="!email_valid || !password_valid" @click="login" :label="$t('Submit')" class="w-full bg-grass"/>

      </form>

  </div class="w-full  bg-cover relative h-screen flex justify-center items-center">
</template>
<script setup lang="ts">
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import ProgressBar from 'primevue/progressbar';


import {useAuthStore} from "@/stores/AuthStore"
import {useRouter} from 'vue-router'

const authStore = useAuthStore()


import { ref,computed } from 'vue';

const email = ref<string|null>(null);
const password = ref<string|null>(null)

const email_touched = ref<boolean>(false)
const password_touched = ref(false)



const email_valid = computed(()=>{
 return email.value?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
})

const password_valid = computed(()=>{
return password.value!=null && password.value !='';
})


const loading = ref(false)

const router = useRouter()
  

const login = async ()=>{
loading.value = true
  const resp = await authStore.login(email.value!,password.value!);
  if(!resp.error){
    router.push({name:'default'});
  }
  loading.value = false
}


</script>
