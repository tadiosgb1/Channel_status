<template>
  <div class="min-h-screen flex bg-gray-50">

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:relative md:translate-x-0"
      :class="{
        '-translate-x-full': !sidebarOpen && isMobile,
        'translate-x-0': sidebarOpen || !isMobile
      }"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center mt-6 mb-4">
        <img src="@/assets/img/logo1.JPG" alt="Logo" class="rounded-full w-20 h-20"/>
      </div>

      <!-- Sidebar Menu -->
      <nav class="flex-1 px-4 space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.name"
          @click="navigate(item.path)"
          class="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          <i :class="item.icon" class="text-orange-500 w-5"></i>
          <span>{{ item.name }}</span>
        </button>

        <button
          @click="logout"
          class="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded mt-4"
        >
          <i class="fas fa-sign-out-alt text-orange-500 w-5"></i>
          <span>Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen md:ml-64">
      
      <!-- Top Nav Bar -->
      <header class="flex items-center justify-between bg-white shadow px-4 py-3">
        <div class="flex items-center space-x-3">
          <!-- Hamburger for mobile -->
          <button class="md:hidden" @click="sidebarOpen = !sidebarOpen">
            <i class="fas fa-bars text-gray-700"></i>
          </button>
          <h1 class="text-xl font-semibold">Dashboard</h1>
        </div>

        <div class="flex items-center space-x-3">
          <button @click="showLanguageModal = true" class="px-2 py-1 rounded hover:bg-gray-100">
            <i class="fas fa-language text-orange-500"></i>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

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

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Toast from "@/components/reUsableComponents/Toast.vue";
import ApiService from "@/Services/ApiService";

// Props (Optional)
const props = defineProps({
  isMobile: Boolean
});

const emit = defineEmits(["changeLanguage"]);

const router = useRouter();
const toast = ref(null);

const sidebarOpen = ref(false);
const showLanguageModal = ref(false);
const languages = ["English", "Tigrigna", "Amharic", "Oromo", "Somali"];

// Example Sidebar Menu
const menuItems = [
  { name: "Beneficiary", path: "/beneficiary", icon: "fas fa-user-friends" },
  { name: "Change PIN", path: "/change-pin", icon: "fas fa-key" },
  { name: "QR Scanner", path: "/qr-scanner", icon: "fas fa-qrcode" },
  { name: "About Us", path: "/about", icon: "fas fa-info-circle" },
  { name: "Exchange Rate", path: "/exchange", icon: "fas fa-credit-card" },
];

// Responsive detection
const isMobile = computed(() => window.innerWidth < 768);

// Methods
const navigate = (path) => {
  router.push(path);
  if (isMobile.value) sidebarOpen.value = false;
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

const selectLanguage = (lang) => {
  localStorage.setItem("appLanguage", lang.toLowerCase());
  emit("changeLanguage", lang);
  showLanguageModal.value = false;
  toast.value.showSuccessToastMessage(`Language changed to ${lang}`);
};

// Handle window resize
onMounted(() => {
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) sidebarOpen.value = true;
  });
});
</script>

<style scoped>
/* Slide left for modal */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
