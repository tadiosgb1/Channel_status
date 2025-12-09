<template>
  <div
    class="w-full bg-primary text-white flex flex-col items-center py-6 lg:rounded-tr-xl lg:rounded-tl-xl"
  >
    <header class="w-full flex justify-start items-center px-4 py-2 bg-primary">
      <div class="relative inline-block">
        <button
          @click="toggleLanguageDropdown"
          class="flex items-center p-1 text-white rounded-md hover:bg-primary-dark focus:outline-none"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <i class="fas fa-globe text-lg mr-2"></i>
          <span>{{ currentLanguage }}</span>
        </button>

        <transition name="fade">
          <ul
            v-if="isLangOpen"
            class="absolute mt-2 w-40 bg-white border border-gray-200 shadow-lg z-50 text-gray-600"
          >
            <li v-for="(label, code) in languages" :key="code">
              <button
                @click="changeLang(code)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                {{ label }}
              </button>
            </li>
          </ul>
        </transition>
      </div>
    </header>

    <img src="@/assets/logo.JPG" alt="Wegagen Bank" class="h-16 my-10" />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useLocaleStore } from "@/store/pinia/useLocaleStore";

// i18n setup
const { locale } = useI18n();
const localeStore = useLocaleStore();

const isLangOpen = ref(false);
const currentLanguage = ref("English");
const currentComponent = ref(null);
const languages = {
  english: "English",
  amharic: "Amharic",
  tigrigna: "Tigrigna",
  oromia: "Oromia",
  somali: "Somali",
};

const toggleLanguageDropdown = () => {
  isLangOpen.value = !isLangOpen.value;
};

const changeLang = (langCode) => {
  locale.value = langCode;
  localeStore.changeLocale(langCode);
  currentLanguage.value = languages[langCode];
  isLangOpen.value = false;
};
// Choose which component to render based on r
onMounted(() => {
  localeStore.loadSavedLocale();
  currentLanguage.value = languages[localeStore.getLocale] || "English";
});
</script>
