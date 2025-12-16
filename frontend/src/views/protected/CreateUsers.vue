<template>
  <div class="p-6 bg-gray-100 min-h-screen">

 <!-- Header Card -->
    <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold   flex items-center">
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
    <div class="overflow-hidden rounded-xl border border-primary mt-6 bg-white shadow-sm">
    <table class="min-w-full border border-primary rounded-lg overflow-hidden">
      <thead class="bg-secondary text-white">
        <tr class="border border-primary">
          <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">First Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Last Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Email</th>
          <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Username</th>
          <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">Status</th>
          <th class="px-2 py-3 text-left text-sm font-medium uppercase border border-primary">Role</th>
          <th class="px-6 py-3 text-center text-sm font-medium uppercase border border-primary">Actions</th>
        </tr>
      </thead>

      <tbody class="bg-white border border-primary">
        <tr 
          v-for="user in users"
          :key="user.id"
          class="hover:bg-gray-50 transition "
        >
          <td class="px-6 py-4 border border-primary">{{ user.first_name }}</td>
          <td class="px-6 py-4 border border-primary">{{ user.last_name }}</td>
          <td class="px-6 py-4 border border-primary">{{ user.email }}</td>
          <td class="px-6 py-4 border border-primary">{{ user.username }}</td>
          <td class="px-2 py-4 border border-primary text-green-600 hover:text-green-800 font-semibold"  v-if="user.status === 'Active'">{{ user.status }}</td>
          <td class="px-2 py-4 border border-primary text-orange-600 hover:text-orange-800 font-semibold"  v-else>{{ user.status }}</td>

          <td class="px-6 py-4 border border-primary">
            <span
              class="px-1 py-1 rounded-full text-white text-sm font-semibold"
              :class="user.role === 'Admin' ? 'bg-[#0f3c50]' : 'bg-[#0f3c50]'"
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

          <button
          v-if="user.status === 'Active'"
              @click="deactivateUser(user.id)"
              class="text-orange-600 hover:text-orange-800 font-semibold"
            >
              <i class="fa-solid fa-user-slash mr-1"></i>
              Block
            </button>

            <button
              v-else
              @click="activateUser(user.id)"
              class="text-green-600 hover:text-green-800 font-semibold"
            >
              <i class="fa-solid fa-user-check mr-1"></i>
              Unblock 
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

        <h2 class="text-xl font-bold text-center text-[#1f3c50] mb-4">
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </h2>

        <form @submit.prevent="isEditing ? updateUser() : createUser()">
          <div class="flex justify-between">
            <div class="mb-3 w-1/2 mr-2">
              <label class="text-sm font-semibold text-gray-700  block">First Name *</label>
              <input
                v-model="form.first_name"
                type="text"
                class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
                placeholder="Enter first name"
                required
              />
            </div>

            <div class="mb-3 w-1/2 ml-2">
              <label class="text-sm font-semibold text-gray-700  block">Last Name *</label>
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
            <label class="text-sm font-semibold text-gray-700  block  ">Email *</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
              placeholder="Enter email address"
              required
            />
          </div>
          <div class="mb-3">
            <label class="text-sm font-semibold text-gray-700  block">Username *</label>
            <input
              v-model="form.username"
              type="username"
              class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary custom-input"
              placeholder="Enter username "
              required
            />
          </div>
          <div class="mb-3" v-if="!isEditing">
            <label class="text-sm font-semibold text-gray-700  block">Password *</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-secondary custom-input"
              placeholder="Enter password"
              required
            />
          </div>

          <div class="mb-4">
            <label class="text-sm font-semibold text-gray-700  block">Role *</label>
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
  username:"",
  password: "",
  role: "User",
});

const openModal = () => {
  showModal.value = true;
  isEditing.value = false;
};

const closeModal = () => {
  showModal.value = false;
  form.value = { id: null, first_name: "", last_name: "", email: "",username:"", password: "", role: "User" };
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
    await api.patch(`/users/${form.value.id}`, form.value);
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

const deactivateUser = async (id) => {
  if (!confirm("Deactivate this user?")) return;

  try {
    await api.patch(`/users/${id}/deactivate`);
    proxy.$refs.toast.showSuccessToastMessage("User deactivated!");
    getAllUsers();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to deactivate user");
  }
};

const activateUser = async (id) => {
  if (!confirm("Activate this user?")) return;

  try {
    await api.patch(`/users/${id}/activate`);
    proxy.$refs.toast.showSuccessToastMessage("User activated!");
    getAllUsers();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to activate user");
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
