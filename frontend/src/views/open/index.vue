<template>
  <div class="min-h-screen flex justify-center bg-[#006523]/5">
    <div
      class="flex flex-col items-center bg-white w-full max-w-md shadow-lg lg:rounded-xl my-0 lg:my-10"
    >
      <div
        class="w-full bg-primary text-white flex flex-col items-center py-6 lg:rounded-tr-xl lg:rounded-tl-xl"
      >
        <header
          class="w-full flex justify-start items-center px-4 py-2 bg-primary"
        >
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useLocaleStore } from "@/store/pinia/useLocaleStore";

// 1. Import the 4 components
import Login from "./loginView.vue";
import Wellcome from "./wellcomeView.vue";
import ActivateAccount from "./ActivateAccount.vue";
import SendOtp from "./sendOTP.vue";

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

  const r = 2; // change this value for testing: 1=Wellcome, 2=Login, 3=Activate, 4=Send OTP

  if (r === 1) currentComponent.value = Wellcome;
  else if (r === 2) currentComponent.value = Login;
  else if (r === 3) currentComponent.value = ActivateAccount;
  else if (r === 4) currentComponent.value = SendOtp;
});
</script>
