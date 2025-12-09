<template>
  <div>
    <Toast ref="toast" />

    <!-- Mobile overlay -->
    <div
      v-if="props.isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:relative md:translate-x-0"
      :class="{
        '-translate-x-full': !props.isSidebarOpen && props.isMobile,
        'translate-x-0': props.isSidebarOpen || !props.isMobile
      }"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center mt-6 mb-4">
        <img src="@/assets/img/logo1.JPG" alt="Logo" class="rounded-full" />
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-4 space-y-2">
        <!-- Language Modal Trigger -->
        <button
          @click="showLanguageModal = true"
          class="w-full flex items-center justify-between px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <div class="flex items-center space-x-2">
            <i class="fas fa-language text-orange-500"></i>
            <span>Change Language</span>
          </div>
        </button>

        <!-- Exchange Rate -->
        <button
          @click="showExchangeModal = true"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-credit-card text-orange-500"></i>
          <span>Exchange Rate</span>
        </button>

        <!-- Other Menu -->
        <button
          @click="navigate('/beneficiary')"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-user-friends text-orange-500"></i>
          <span>Beneficiary</span>
        </button>

        <button
          @click="navigate('/change-pin')"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-key text-orange-500"></i>
          <span>Change PIN</span>
        </button>

        <button
          @click="navigate('/qr-scanner')"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-qrcode text-orange-500"></i>
          <span>QR Scanner</span>
        </button>

        <button
          @click="navigate('/about')"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-info-circle text-orange-500"></i>
          <span>About Us</span>
        </button>

        <button
          @click="logout"
          class="w-full flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i class="fas fa-sign-out-alt text-orange-500"></i>
          <span>Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Language Modal -->
    <transition name="slide-left">
      <div v-if="showLanguageModal" class="fixed inset-0 z-50 flex">
        <div class="flex-1 bg-black bg-opacity-50" @click="showLanguageModal = false" />
        <div class="w-64 bg-white h-full shadow-lg flex flex-col">
          <div class="bg-orange-500 text-white px-4 py-3 text-lg font-semibold">
            Choose Language
          </div>
          <div class="flex-1 p-4 space-y-3">
            <button
              v-for="lang in languages"
              :key="lang"
              @click="selectLanguage(lang)"
              class="w-full text-left px-4 py-3 rounded bg-orange-50 hover:bg-orange-100 transition"
            >
              {{ lang }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Exchange Modal -->
    <transition name="fade-scale">
      <div v-if="showExchangeModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="showExchangeModal = false"></div>
        <div class="relative w-11/12 md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <div class="bg-orange-500 text-white px-4 py-3 text-lg font-semibold flex justify-between items-center">
            Exchange Rates
            <button @click="showExchangeModal = false" class="text-white hover:text-gray-200">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="px-4 py-2 text-sm md:text-base font-medium border-b border-gray-200 bg-orange-50">
            {{ exchangeDate }}
          </div>

          <div class="p-4 max-h-96 overflow-y-auto">
            <div class="grid grid-cols-6 gap-2 font-semibold border-b border-gray-200 pb-2 mb-2 text-sm md:text-base">
              <div>Currency</div>
              <div>Unit</div>
              <div>Buying</div>
              <div>Selling</div>
              <div>Tra Buying</div>
              <div>Tra Selling</div>
            </div>

            <transition-group name="slide-fade" tag="div">
              <div
                v-for="item in exchangeRates"
                :key="item.id"
                class="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-100 text-sm md:text-base"
              >
                <div class="flex items-center space-x-2">
                  <img
                    v-if="item.attributes.flag.data[0]"
                    :src="baseURL + item.attributes.flag.data[0].attributes.url"
                    :alt="item.attributes.code"
                    class="w-6 h-4 object-cover rounded"
                  />
                  <span>{{ item.attributes.code }}</span>
                </div>
                <div>{{ item.attributes.unit }}</div>
                <div>{{ item.attributes.buying }}</div>
                <div>{{ item.attributes.selling }}</div>
                <div>{{ item.attributes.traBuying }}</div>
                <div>{{ item.attributes.traSelling }}</div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ApiService from "@/Services/ApiService";
import Toast from '@/components/reUsableComponents/Toast.vue';
import { useRouter } from "vue-router";

const props = defineProps({
  isSidebarOpen: Boolean,
  isMobile: Boolean
});
const emit = defineEmits(["close", "changeLanguage"]);

const toast = ref(null);
const showLanguageModal = ref(false);
const showExchangeModal = ref(false);
const exchangeRates = ref([]);
const exchangeDate = ref("");
const languages = ["English", "Tigrigna", "Amharic", "Oromo", "Somali"];
const baseURL = "https://weg.back.strapi.wegagen.com";

const router = useRouter();

// --- Methods ---
const closeSidebar = () => emit("close");

const navigate = (path) => {
  router.push(path);
  closeSidebar();
};

const selectLanguage = (lang) => {
  localStorage.setItem("appLanguage", lang.toLowerCase());
  emit("changeLanguage", lang);
  showLanguageModal.value = false;
  closeSidebar();
  toast.value.showSuccessToastMessage(`Language changed to ${lang}`);
};

const logout = async () => {
  const res = await ApiService.logout();
  if (res.status) {
    localStorage.clear();
    toast.value.showSuccessToastMessage("Logout successful!");
    router.push("/login");
  } else {
    toast.value.showErrorToastMessage("Logout failed");
  }
};

const fetchExchangeRates = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/exchange-rates?populate=*`);
    exchangeRates.value = res.data.data;
    if (exchangeRates.value.length > 0) {
      exchangeDate.value = exchangeRates.value[0].attributes.date;
    }
  } catch (err) {
    console.error("Failed to fetch exchange rates:", err);
  }
};

// --- Lifecycle ---
onMounted(() => {
  fetchExchangeRates();
  const savedLang = localStorage.getItem("appLanguage");
  if (savedLang) console.log("Saved language:", savedLang);
});
</script>

<style scoped>
/* Sidebar modal slide-left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

/* Centered modal fade + scale */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Row animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Modal fade-in animation */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
