import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/PokeDexVue/service-worker.js", { scope: "/PokeDexVue/" })
            .then((reg) => console.log("Service worker geregistreerd:", reg))
            .catch((err) => console.error("Service worker registratie mislukt:", err));
    });
}

const app = createApp(App)

app.use(router)

app.mount('#app')