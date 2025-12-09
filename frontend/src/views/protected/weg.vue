<template>
  <div class="flex flex-col h-screen bg-gray-100 font-sans">
    <!-- Overlay for mobile -->
    <div
      v-if="showLeftSidebar && screenWidth < 1024"
      class="fixed inset-0 z-20 bg-black bg-opacity-50"
      @click="toggleSidebar"
    ></div>

    <!-- Mobile Sidebar with transition -->
    <transition name="slide">
      <leftSidebar
        v-if="screenWidth < 1024"
        v-show="showLeftSidebar"
        class="fixed top-0 left-0 h-screen w-64 bg-white z-30 shadow-md"
      />
    </transition>

    <!-- Desktop Sidebar (always visible, no animation) -->
    <leftSidebar
      v-if="screenWidth >= 1024"
      class="fixed top-0 left-0 h-screen w-64 bg-white z-30 "
    />

    <!-- Main area -->
    <div
      :class="{ 'lg:ml-64': screenWidth >= 1024 }"
      class="flex-1 flex flex-col min-h-0 transition-all duration-300"
    >
      <!-- Header -->
      <div class="bg-orange-500 text-white px-10 py-4 pb-32">
        <div class="flex flex-row items-center justify-between">
          <!-- Toggle and greeting -->
          <div class="flex items-center space-x-4">
            <button
              v-if="showToggleButton"
              @click="toggleSidebar"
              class="text-white hover:text-yellow-200 focus:outline-none"
            >
              <i class="fas fa-bars text-2xl"></i>
            </button>
            <h1 class="text-2xl font-semibold mt-3">Hello, {{ accountHolderName }}</h1>
          </div>
        </div>

        <!-- Balance below -->
        <div class="mt-3">
          <Balance />
        </div>
      </div>

      <!-- Main content -->
      <newd class="px-10"/>
    </div>

    <!-- Change PIN Modal -->
    <ChangePinModal
      v-if="showChangePinModal"
      @close="closeChangePinModal"
      @submit="handlePinChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import leftSidebar from "@/components/layouts/leftSidevar.vue";
import Balance from "./balance.vue";
import newd from "./newd.vue";
import ChangePinModal from "@/views/protected/Profile/ChangePin.vue";
import { useAccountList } from "@/Services/useAccountList";

const showLeftSidebar = ref(false);
const showToggleButton = ref(false);
const showChangePinModal = ref(false);
const screenWidth = ref(window.innerWidth);

const { accounts, fetchAccounts } = useAccountList();

const accountHolderName = computed(() => {
  if (accounts.value.length > 0) {
    const fullName = accounts.value[0].name || "";
    const firstName = fullName.split(" ")[0] || "";
    return firstName;
  }
  return "Loading...";
});

const handleResize = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value >= 1024) {
    showLeftSidebar.value = true; // desktop: always visible
    showToggleButton.value = false;
  } else {
    showLeftSidebar.value = false; // mobile: hidden until toggled
    showToggleButton.value = true;
  }
};

const toggleSidebar = () => {
  showLeftSidebar.value = !showLeftSidebar.value;
};

const openChangePinModal = () => {
  showChangePinModal.value = true;
};
const closeChangePinModal = () => {
  showChangePinModal.value = false;
};

const handlePinChange = (pinData) => {
  console.log("Changing PIN:", pinData);
  closeChangePinModal();
};

onMounted(() => {
  handleResize();
  fetchAccounts();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Mobile slide-in animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
