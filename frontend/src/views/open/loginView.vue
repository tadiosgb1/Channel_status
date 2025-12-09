<template>
  <div class="min-h-screen flex justify-center items-center bg-[#0f3c50]">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 flex flex-col items-center">
      <!-- Brand Logo -->
      <img src="@/assets/logo.png" alt="Brand Logo" class="w-16 h-16 mb-4" />

      <!-- Title -->
      <h2 class="text-2xl font-bold text-[#1f3c50] mb-2">Welcome Back!</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Log in to access reports</p>

      <!-- Username Input -->
      <div class="w-full mb-4">
        <label class="flex items-center text-sm font-semibold text-gray-700 mb-1">
          <i class="fa-solid fa-user mr-2"></i> Username *
        </label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter your username"
          class="w-full h-12 px-4 border border-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      <!-- Password Input -->
      <div class="w-full mb-6">
        <label class="flex items-center text-sm font-semibold text-gray-700 mb-1">
          <i class="fa-solid fa-lock mr-2"></i> Password *
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full h-12 px-4 border border-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      <!-- Login Button -->
      <button
        @click="verifyLogin"
        class="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary transition"
      >
      <i class="fa-solid fa-right-to-bracket mr-2"></i>
        Log In
      </button>

    </div>
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Toast from '../../components/reUsableComponents/Toast.vue';

const username = ref('');
const password = ref('');
const router = useRouter();
const { proxy } = getCurrentInstance();

const verifyLogin = async () => {
  if (!username.value || !password.value) {
    proxy.$refs.toast.showErrorToastMessage("Username and password are required");
    return;
  }

  const payload = {
    phone: username.value,
    password: password.value,
  };

  try {
    const res = await axios.post(
      'https://gateway.wegagentraining.com/auth/login',
      payload,
      { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
    );

    if (res.data.status) {
      localStorage.setItem('userPhone', username.value);
      localStorage.setItem("isAuthenticated", true);

      proxy.$refs.toast.showSuccessToastMessage("Login successful!");
      router.push('/dashboard');
    } else {
      proxy.$refs.toast.showErrorToastMessage("Invalid username or password");
    }
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Network or server error");
  }
};
</script>
