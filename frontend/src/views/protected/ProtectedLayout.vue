<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 ml-64 p-6">
      
      <!-- Header -->
      <header class="mb-6 flex justify-between items-center bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold">Welcome, {{ user?.name || 'User' }}</h2>

        <!-- Logout Icon -->
        <button
          @click="showModal = true"
          class="text-primary hover:text-primary/80 text-2xl"
          title="Logout"
        >
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </header>

      <!-- Nested Routes -->
      <main>
        <router-view />
      </main>

      <!-- Logout Confirmation Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">

          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-black"
            @click="showModal = false"
          >
            ✖
          </button>

          <h2 class="text-xl font-bold text-center mb-4 text-gray-800">
            Confirm Logout
          </h2>

          <p class="text-gray-600 text-center mb-6">
            Are you sure you want to log out?
          </p>

          <div class="flex justify-between">
            <button
              @click="showModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              @click="logout"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
            >
              Yes, Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layouts/Sidebar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showModal = ref(false);

// Example user, replace with store
const user = { name: 'Admin' };

const logout = () => {
  localStorage.removeItem("isAuthenticated");
  router.push('/login');
};
</script>
