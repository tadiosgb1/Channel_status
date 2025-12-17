<template>
  <!-- Mobile Top Bar -->
  <div
    class="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 h-14"
  >
    <!-- Hamburger Button -->
    <button
      @click="toggleSidebar"
      class="w-10 h-10 flex items-center justify-center rounded-md border text-primary text-2xl"
      aria-label="Toggle Menu"
    >
      ☰
    </button>
  </div>

  <!-- Overlay (mobile only) -->
  <div
    v-if="isOpen"
    @click="toggleSidebar"
    class="fixed inset-0 bg-black/40 z-40 lg:hidden"
  ></div>

  <!-- Sidebar -->
  <aside
    class="w-64 bg-white border-r h-screen fixed shadow-md z-50 transform transition-transform duration-300"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full', 'lg:translate-x-0 lg:top-0 top-14']"
  >
    <!-- Logo -->
    <div class="pt-4 px-4">
      <h1 class="text-2xl font-bold text-primary">Wegagen Report</h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-8">
      <ul class="space-y-1">
        <li>
          <RouterLink
            :to="{ name: 'dashboard' }"
            @click="closeOnMobile"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('dashboard') }"
          >
            <span class="mr-3"><i class="fa-solid fa-gauge"></i></span>
            Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'check-status' }"
            @click="closeOnMobile"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('check-status') }"
          >
            <span class="mr-3"><i class="fa-solid fa-chart-line"></i></span>
            Check Status
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :to="{ name: 'create-users' }"
            @click="closeOnMobile"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('create-users') }"
          >
            <span class="mr-3"><i class="fa-solid fa-user"></i></span>
            Users
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :to="{ name: 'cases' }"
            @click="closeOnMobile"
            class="flex items-center justify-between p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('cases') }"
          >
            <div class="flex items-center">
              <span class="mr-3"><i class="fa-solid fa-briefcase"></i></span>
              Cases
            </div>
            <!-- Pending cases count badge -->
            <span v-if="pendingCount > 0"
              class="bg-[#0f3c50] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {{ pendingCount }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiService from '@/services/ApiService'

const route = useRoute()
const isOpen = ref(false)
const pendingCount = ref(0)
const api = new ApiService()

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeOnMobile = () => {
  if (window.innerWidth < 1024) {
    isOpen.value = false
  }
}

const isActive = (name) => route.name === name

// Fetch pending cases count
const getPendingCasesCount = async () => {
  try {
    const res = await api.get('/case')
    // Count only cases with status "Pending"
    pendingCount.value = res.data.filter(c => c.status.toLowerCase() === 'pending').length
  } catch (err) {
    console.error('Failed to fetch pending cases count:', err)
  }
}

onMounted(() => {
  getPendingCasesCount()
})
</script>

<style scoped>
nav ul li a {
  transition: all 0.25s ease-out;
}
</style>
