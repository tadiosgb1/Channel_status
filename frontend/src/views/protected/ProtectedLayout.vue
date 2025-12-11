<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 ml-64 p-6">

      <!-- Header Card -->
      <header class="mb-6 flex justify-between items-center bg-white p-6 rounded-2xl shadow-md">
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <img
            :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.first_name || 'User')"
            alt="Avatar"
            class="w-14 h-14 rounded-full border-2 border-primary object-cover"
          />
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              Welcome, {{ user?.first_name || 'User' }}
            </h2>
            <p class="text-gray-500 text-sm capitalize">Role: {{ user?.role || 'Admin' }}</p>
          </div>
        </div>

        <!-- Logout Icon -->
        <button
          @click="showModal = true"
          class="text-primary hover:text-primary/80 text-3xl p-2 rounded-full hover:bg-primary/10 transition"
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
        <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative border-t-4 border-primary">

          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
            @click="showModal = false"
          >
            ✖
          </button>

          <h2 class="text-2xl font-bold text-center mb-4 text-gray-800 flex justify-center items-center space-x-2">
            <i class="fa-solid fa-right-from-bracket text-primary"></i>
            <span>Confirm Logout</span>
          </h2>

          <p class="text-gray-600 text-center mb-6">
            Are you sure you want to log out from your account?
          </p>

          <div class="flex justify-center gap-4">
            <button
              @click="showModal = false"
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              @click="logout"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showModal = ref(false);
const user = ref({});

// Load user info from localStorage
onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  } else {
    // fallback default
    user.value = {
      first_name: 'Admin',
      role: 'Admin',
      avatar: ''
    };
  }
});

const logout = () => {
  localStorage.removeItem('isAuthenticated');
  router.push('/login');
};
</script>

<style>
/* Tailwind CSS primary color example (adjust in tailwind.config.js) */

</style>
