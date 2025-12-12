<template>
  <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
    <h2 class="text-xl font-semibold">Dashboard (Protected)</h2>

    <div class="flex gap-2">
      <button @click="fetchMe" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Fetch /me</button>
      <button @click="refresh" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Refresh Token</button>
      <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
    </div>

    <div v-if="me" class="bg-gray-100 p-4 rounded">
      <pre class="text-sm">{{ me }}</pre>
    </div>

    <p v-if="message" :class="error ? 'text-red-500' : 'text-green-600'">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const me = ref('');
const message = ref('');
const error = ref(false);

async function fetchMe() {
  message.value = ''; error.value = false;
  try {
    const { data } = await api.get('/api/auth/me');
    me.value = JSON.stringify(data, null, 2);
  } catch (e) {
    error.value = true;
    message.value = e.response?.data?.message || 'Failed to fetch /me';
    if (e.response?.status === 401) {
      try {
        await api.post('/api/auth/refresh');
        const { data } = await api.get('/api/auth/me');
        me.value = JSON.stringify(data, null, 2);
        error.value = false; message.value = '';
      } catch {
        router.push('/login-test');
      }
    }
  }
}

async function refresh() {
  try {
    await api.post('/api/auth/refresh');
    message.value = 'Token refreshed';
  } catch (e) {
    error.value = true;
    message.value = e.response?.data?.message || 'Refresh failed';
  }
}

async function logout() {
  try {
    await api.post('/api/auth/logout');
    me.value = '';
    router.push('/login-test');
  } catch (e) {
    error.value = true;
    message.value = e.response?.data?.message || 'Logout failed';
  }
}
</script>
