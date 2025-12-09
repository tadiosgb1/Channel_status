<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <!-- Tabs -->
      <div class="flex border-b mb-4">
        <button
          class="flex-1 py-2 text-center font-medium"
          :class="activeTab === 'login' ? 'border-b-2 text-brand border-brand' : 'text-gray-500'"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          class="flex-1 py-2 text-center font-medium"
          :class="activeTab === 'register' ? 'border-b-2 text-brand border-brand' : 'text-gray-500'"
          @click="activeTab = 'register'"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="submit" class="space-y-4">
        <h2 class="text-xl font-semibold text-center text-brand">Login</h2>
        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/40"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/40"
          />
        </div>
        <button
          :disabled="loading"
          class="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-50"
        >
          {{ loading ? '...' : 'Login' }}
        </button>
        <p v-if="message" :class="error ? 'text-red-500' : 'text-green-600'" class="text-center">{{ message }}</p>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="register" class="space-y-4">
        <h2 class="text-xl font-semibold text-center text-brand">Register</h2>
        <div>
          <label class="block mb-1 text-sm font-medium">Name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/40"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/40"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-brand/40"
          />
        </div>
        <button
          :disabled="loading"
          class="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-50"
        >
          {{ loading ? '...' : 'Register' }}
        </button>
        <p v-if="message" :class="error ? 'text-red-500' : 'text-green-600'" class="text-center">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const loading = ref(false);
const message = ref('');
const error = ref(false);
const activeTab = ref('login'); // 'login' or 'register'

async function submit() {
  loading.value = true; message.value = ''; error.value = false;
  try {
    await api.post('/api/auth/login', { email: email.value, password: password.value });
    router.push('/dashboard-test');
  } catch (e) {
    error.value = true;
    message.value = e.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}

async function register() {
  loading.value = true; message.value = ''; error.value = false;
  try {
    await api.post('/api/auth/register', { email: email.value, password: password.value, name: name.value });
    message.value = 'Registered. Now login.';
    activeTab.value = 'login'; // Switch back to login
  } catch (e) {
    error.value = true;
    message.value = e.response?.data?.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Brand color from your image */
.text-brand { color: #FF6A00; }
.bg-brand { background-color: #FF6A00; }
.hover\:bg-brand-dark:hover { background-color: #e55e00; }
.focus\:ring-brand\/40:focus { --tw-ring-color: rgb(255 106 0 / 0.4); }
.border-brand { border-color: #FF6A00; }
</style>
