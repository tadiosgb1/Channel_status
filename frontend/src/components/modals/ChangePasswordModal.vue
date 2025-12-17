<!-- src/components/modals/ChangePassword.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">

      <!-- Close Button -->
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

        <!-- Old Password -->
        <div class="mb-4 relative">
          <label class="block text-sm font-semibold mb-1">Old Password *</label>
          <input
            v-model="form.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            required
            class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter current password"
          />
          <button
            type="button"
            @click="showOldPassword = !showOldPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {{ showOldPassword ? "🙈" : "👁️" }}
          </button>
        </div>

        <!-- New Password -->
        <div class="mb-4 relative">
          <label class="block text-sm font-semibold mb-1">New Password *</label>
          <input
            v-model="form.newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            required
            class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter new password"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {{ showNewPassword ? "🙈" : "👁️" }}
          </button>
        </div>

        <!-- Confirm Password -->
        <div class="mb-6 relative">
          <label class="block text-sm font-semibold mb-1">Confirm Password *</label>
          <input
            v-model="form.password_confirmation"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Confirm new password"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {{ showConfirmPassword ? "🙈" : "👁️" }}
          </button>
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
  oldPassword: "",
  newPassword: "",
  password_confirmation: ""
});

// Password visibility toggles
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const updatePassword = async () => {
  if (!form.value.oldPassword || !form.value.newPassword) {
    proxy.$refs.toast.showErrorToastMessage("Old and new passwords are required");
    return;
  }

  if (form.value.newPassword !== form.value.password_confirmation) {
    proxy.$refs.toast.showErrorToastMessage("New passwords do not match");
    return;
  }

  try {
    const payload = {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    };
    const res = await api.post(`/auth/change-password`, payload);
    if (res) {
      proxy.$refs.toast.showSuccessToastMessage(res.message || "Password updated successfully!");
      form.value.oldPassword = "";
      form.value.newPassword = "";
      form.value.password_confirmation = "";

      setTimeout(() => {
        emit('close');
      }, 2000); // Close modal after 2 seconds
    }
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Failed to update password");
  }
};
</script>
