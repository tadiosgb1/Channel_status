<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 ml-64 p-6">
      <header class="mb-6 flex justify-between items-center bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold">Welcome, {{ user?.name || 'User' }}</h2>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          @click="logout"
        >
          Logout
        </button>
      </header>

      <!-- Nested page content -->
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layouts/Sidebar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dummy user for example; replace with auth store
const user = { name: 'Admin' };

const logout = () => {
  localStorage.removeItem("isAuthenticated");
  router.push('/login');
};
</script>
