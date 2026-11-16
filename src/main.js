import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { setupI18n } from "./i18n/index.js";
import { responsiveTableCards } from "./directives/responsiveTableCards.js";
import "./assets/css/main.css";

const app = createApp(App);

app.directive("responsive-table-cards", responsiveTableCards);
app.use(createPinia());
app.use(router);
setupI18n(app);

app.mount("#app");
