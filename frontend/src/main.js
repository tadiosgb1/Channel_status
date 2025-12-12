import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
//import store from './store';
import { createPinia } from 'pinia';
import globals from './globals/globals.js';
import './assets/global.css';
import { createI18n } from 'vue-i18n';
import amharic from '@/i18n/locales/amharic.json';
import english from '@/i18n/locales/english.json';
import tigrigna from '@/i18n/locales/tigrigna.json';



import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.js'


import oromia from '@/i18n/locales/oromia.json';
import somali from '@/i18n/locales/somali.json';

import apiClientPlugin from "./store/plugins/apiClientPlugin";
import './assets/css/darkmode.css';
import "animate.css";
import VueParticles from "vue-particles";

const pinia = createPinia();


// ✅ CORRECT import for components
import VueQrcodeReader from 'vue-qrcode-reader';

// const defaultLocale = 'amharic';
// const i18n = createI18n({
//   locale: defaultLocale,
//   fallbackLocale: 'english',
//   messages: {
//     amharic: amharicMessages,
//     english: englishMessages,
//     tigrigna: tigrignaMessages,
//   },
// });

export const i18n = createI18n({
  legacy: false, // Enables Composition API mode
  locale: 'english',
  fallbackLocale: 'english',
  messages: {
    amharic,
    english,
    tigrigna,
    oromia,
    somali
  },
});

const app = createApp(App);

//app.use(store);
app.use(globals);
app.use(router);
app.use(pinia);
app.use(i18n);
app.use(VueParticles);
app.use(apiClientPlugin);
app.use(VueQrcodeReader);
app.mount('#app');
