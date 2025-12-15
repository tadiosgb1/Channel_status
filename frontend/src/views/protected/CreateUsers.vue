<template>
  <div class="p-6 bg-gray-100 min-h-screen">

 <!-- Header Card -->
    <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold  mb-1 flex items-center">
          <i class="fa-solid fa-users mr-3"></i>
          User Management
        </h1>
      </div>
      <button
        @click="openModal()"
        class="flex items-center bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/80 transition shadow"
      >
        <i class="fa-solid fa-user-plus mr-2"></i>
        Add User
      </button>
    </div>

    <!-- Users Table -->
    <div class="overflow-x-auto bg-white rounded-xl shadow-sm mt-6">
<table class="min-w-full border border-primary rounded-lg overflow-hidden">
  <thead class="bg-secondary text-white">
    <tr>
      <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">First Name</th>
      <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Last Name</th>
      <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Email</th>
      <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Role</th>
      <th class="px-6 py-3 text-center text-sm font-medium uppercase border border-primary">Actions</th>
    </tr>
  </thead>

  <tbody class="bg-white">
    <tr
      v-for="user in users"
      :key="user.id"
      class="hover:bg-gray-50 transition"
    >
      <td class="px-6 py-4 border border-primary">{{ user.first_name }}</td>
      <td class="px-6 py-4 border border-primary">{{ user.last_name }}</td>
      <td class="px-6 py-4 border border-primary">{{ user.email }}</td>

      <td class="px-6 py-4 border border-primary">
        <span
          class="px-2 py-1 rounded-full text-white text-sm font-semibold"
          :class="user.role === 'Admin' ? 'bg-red-500' : 'bg-green-500'"
        >
          {{ user.role }}
        </span>
      </td>

      <td class="px-6 py-4 text-center space-x-3 border border-primary">
        <button @click="editUser(user)" class="text-blue-500 hover:text-blue-700">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>

        <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-700">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>

    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">

        <!-- Close Button -->
        <button @click="closeModal" class="absolute right-4 top-4 text-gray-500 hover:text-black">
          ✖
        </button>

        <h2 class="text-xl font-bold text-center text-[#1f3c50] mb-4 bg-primary/20 p-3 rounded-lg">
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </h2>

        <form @submit.prevent="isEditing ? updateUser() : createUser()">

         <div class="flex">
            <div class="w-1/2 mr-2">
              <label class="text-sm font-semibold text-gray-700 mb-1 block">First Name *</label>
              <input
                v-model="form.first_name"
                type="text"
                class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
                placeholder="Enter first name"
                required
              />
            </div>

            <div class="w-1/2 ml-2">
              <label class="text-sm font-semibold text-gray-700 mb-1 block">Last Name *</label>
              <input
                v-model="form.last_name"
                type="text"
                class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="text-sm font-semibold text-gray-700 mb-1 block  ">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
              placeholder="Enter email address"
              required
            />
          </div>

          <div class="mb-3" v-if="!isEditing">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">Password *</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
              placeholder="Enter password"
              required
            />
          </div>

          <div class="mb-4">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">Role *</label>
            <select
              v-model="form.role"
              class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <button
            class="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition"
          >
            <i :class="isEditing ? 'fa-solid fa-pen-to-square mr-2' : 'fa-solid fa-save mr-2'"></i>
            {{ isEditing ? 'Update User' : 'Save User' }}
          </button>

        </form>
      </div>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import Toast from "../../components/reUsableComponents/Toast.vue";

const showModal = ref(false);
const isEditing = ref(false);
const { proxy } = getCurrentInstance();
const api = new ApiService();
const users = ref([]);

const form = ref({
  id: null,
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "User",
});

const openModal = () => {
  showModal.value = true;
  isEditing.value = false;
};

const closeModal = () => {
  showModal.value = false;
  form.value = { id: null, first_name: "", last_name: "", email: "", password: "", role: "User" };
};

const createUser = async () => {
  try {
    await api.post("/auth/register", form.value);
    proxy.$refs.toast.showSuccessToastMessage("User created!");
    getAllUsers();
    closeModal();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to save user");
  }
};

const editUser = (user) => {
  form.value = { ...user, password: "" }; // Password is empty for editing
  isEditing.value = true;
  showModal.value = true;
};

const updateUser = async () => {
  try {
    await api.put(`/users/${form.value.id}`, form.value);
    proxy.$refs.toast.showSuccessToastMessage("User updated!");
    getAllUsers();
    closeModal();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to update user");
  }
};

const deleteUser = async (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await api.delete(`/users/${id}`);
      proxy.$refs.toast.showSuccessToastMessage("User deleted!");
      getAllUsers();
    } catch (err) {
      console.error(err);
      proxy.$refs.toast.showErrorToastMessage("Failed to delete user");
    }
  }
};

const getAllUsers = async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

onMounted(() => {
  getAllUsers();
});
</script>
