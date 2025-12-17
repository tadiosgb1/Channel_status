<!-- src/components/modals/ChangePassword.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">

      <!-- Close -->
      <button
        @click="$emit('close')"
        class="absolute right-4 top-4 text-gray-500 hover:text-black"
      >
        ✖
      </button>

      <h2 class="text-xl font-bold text-center text-primary mb-6">
        Change Password
      </h2>

      <form @submit.prevent="updatePassword">
        <div class="mb-4">
          <label class="block text-sm font-semibold mb-1">New Password *</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold mb-1">Confirm Password *</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          class="w-full h-12 bg-primary text-white rounded-lg hover:bg-primary/80"
        >
          Update Password
        </button>
      </form>

    </div>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import ApiService from "@/services/ApiService";
import Toast from "@/components/reUsableComponents/Toast.vue";

const emit = defineEmits(["close"]);
const { proxy } = getCurrentInstance();
const api = new ApiService();

const form = ref({
  password: "",
  password_confirmation: ""
});

const updatePassword = async () => {
  const id = localStorage.getItem("id");
  console.log("id",id)
  if (!id) {
    proxy.$refs.toast.showErrorToastMessage("User ID not found");
    return;
  }

  if (form.value.password !== form.value.password_confirmation) {
    proxy.$refs.toast.showErrorToastMessage("Passwords do not match");
    return;
  }

  try {
    await api.patch(`/users/${id}`, {
      password: form.value.password
    });

    proxy.$refs.toast.showSuccessToastMessage("Password updated!");
    emit("close");
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Failed to update password");
  }
};
</script>
