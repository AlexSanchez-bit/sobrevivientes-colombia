import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import "primevue/resources/themes/aura-light-green/theme.css";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";

import App from "./App.vue";
import router from "./router";

import { i18n } from "./setup";
import permissionDirective from "./directives/permission-directive";

const app = createApp(App);
app.use(ConfirmationService);

app.use(createPinia());
app.use(ToastService);
app.use(router);
app.use(i18n);
app.use(PrimeVue);
app.use(ConfirmationService);
app.directive("tooltip", Tooltip);
app.directive("permission", permissionDirective);
app.mount("#app");
