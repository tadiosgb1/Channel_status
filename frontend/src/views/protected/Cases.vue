<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <!-- Header Card -->
    <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md flex items-center justify-between">
      <h1 class="text-3xl font-semibold  flex items-center">
        <i class="fa-solid fa-briefcase mr-3"></i>
        Case Management
      </h1>

      <button
        @click="openModal()"
        class="flex items-center bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/80 transition shadow"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        New Case
      </button>
    </div>

    <!-- Cases Table -->
<div class="overflow-x-auto bg-white rounded-xl shadow-sm mt-6">
  <table class="min-w-full border border-primary rounded-lg overflow-hidden">
    <thead class="bg-secondary text-white">
      <tr>
        <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">
          Case Title
        </th>
        <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">
          Type
        </th>
        <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">
          Description
        </th>
        <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">
          User
        </th>
        <th class="px-6 py-3 text-left text-sm font-medium uppercase border border-primary">
          Status
        </th>
        <th class="px-6 py-3 text-center text-sm font-medium uppercase border border-primary">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="caseItem in cases"
        :key="caseItem.id"
        class="hover:bg-gray-50 transition"
      >
        <td class="px-6 py-4 border border-primary font-semibold">
          {{ caseItem.case_title }}
        </td>

        <td class="px-6 py-4 border border-primary">
          {{ caseItem.case_type }}
        </td>

        <td class="px-6 py-4 border border-primary">
          {{ caseItem.description }}
        </td>

        <td class="px-6 py-4 border border-primary">
          {{ caseItem.User?.first_name }} {{ caseItem.User?.last_name }}
        </td>

        <td class="px-6 py-4 border border-primary">
          <span
            class="px-2 py-1 rounded-full text-white text-sm font-semibold"
            :class="{
              'bg-green-600': caseItem.status === 'Open',
              'bg-red-600': caseItem.status === 'Closed',
              'bg-yellow-500': caseItem.status === 'Pending'
            }"
          >
            {{ caseItem.status }}
          </span>
        </td>

        <td class="px-6 py-4 border border-primary text-center space-x-2">
          <button
            @click="editCase(caseItem)"
            class="text-blue-500 hover:text-blue-700"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            @click="deleteCase(caseItem.id)"
            class="text-red-500 hover:text-red-700"
          >
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

        <h2 class="text-xl font-bold text-center text-primary mb-4">
          {{ isEditing ? 'Edit Case' : 'Create New Case' }}
        </h2>

        <form @submit.prevent="isEditing ? updateCase() : createCase()">

          <div class="mb-3">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">Case Title *</label>
            <input
              v-model="form.case_title"
              class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div class="mb-3">
  
            <select v-model="form.case_type" class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary" required>
              <option value="ussd">USSD</option>
              <option value="Mobile">Mobile App</option>
  
            </select>
           
          </div>

          <div class="mb-3">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">Description *</label>
            <textarea
              v-model="form.description"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">Status *</label>
            <select
              v-model="form.status"
              class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="text-sm font-semibold text-gray-700 mb-1 block">User *</label>
            <select
              v-model="form.user_id"
              class="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              required
            >
              <option v-for="u in users" :value="u.id" :key="u.id">
                {{ u.first_name }} {{ u.last_name }}
              </option>
            </select>
          </div>

          <button class="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary/80 transition">
            <i :class="isEditing ? 'fa-solid fa-pen-to-square mr-2' : 'fa-solid fa-save mr-2'"></i>
            {{ isEditing ? 'Update Case' : 'Save Case' }}
          </button>

        </form>
      </div>
    </div>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import ApiService from "@/services/ApiService";
import Toast from "../../components/reUsableComponents/Toast.vue";

const api = new ApiService();
const { proxy } = getCurrentInstance();

const cases = ref([]);
const users = ref([]);

const showModal = ref(false);
const isEditing = ref(false);

const form = ref({
  id: null,
  case_type: "",
  case_title: "",
  description: "",
  status: "Open",
  user_id: null,
});

// Open modal
const openModal = () => {
  showModal.value = true;
  isEditing.value = false;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    case_type: "",
    case_title: "",
    description: "",
    status: "Open",
    user_id: null,
  };
};

// CREATE
const createCase = async () => {
  try {
    await api.post("/case", form.value);
    proxy.$refs.toast.showSuccessToastMessage("Case created!");
    getCases();
    closeModal();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to create case");
  }
};

// EDIT
const editCase = (caseItem) => {
  form.value = { ...caseItem };
  isEditing.value = true;
  showModal.value = true;
};

// UPDATE
const updateCase = async () => {
  try {
    await api.patch(`/case/${form.value.id}`, form.value);
    proxy.$refs.toast.showSuccessToastMessage("Case updated!");
    getCases();
    closeModal();
  } catch (err) {
    console.error(err);
    proxy.$refs.toast.showErrorToastMessage("Failed to update case");
  }
};

// DELETE
const deleteCase = async (id) => {
  if (confirm("Are you sure?")) {
    try {
      await api.delete(`/case/${id}`);
      proxy.$refs.toast.showSuccessToastMessage("Case deleted!");
      getCases();
    } catch (err) {
      console.error(err);
      proxy.$refs.toast.showErrorToastMessage("Failed to delete case");
    }
  }
};

// FETCH CASES
const getCases = async () => {
  const res = await api.get("/case");
  cases.value = res.data;
};

// FETCH USERS (for dropdown)
const getUsers = async () => {
  const res = await api.get("/users");
  users.value = res.data;
};

onMounted(() => {
  getCases();
  getUsers();
});
</script>
