<template>
  <div class="p-6 bg-gray-100 min-h-screen">

    <!-- Header -->
    <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md flex items-center justify-between">
      <h1 class="text-xl font-semibold flex items-center">
        <i class="fa-solid fa-briefcase mr-3"></i>
        Case Management
      </h1>

      <button v-if="role === 'Admin'"
        @click="openModal"
        class="flex items-center bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/80 transition shadow"
      >
        <i class="fa-solid fa-plus mr-2"></i>
        New Case
      </button>
    </div>

    <!-- ================= FILTERS ================= -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 bg-white p-4 rounded-xl shadow">
      <div>
        <label class="text-sm font-semibold">Date Type</label>
        <select v-model="filters.date_type" class="custom-input w-full h-10">
          <option value="">Select</option>
          <option value="created">Created Date</option>
          <option value="updated">Updated Date</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-semibold">From</label>
        <input type="date" v-model="filters.from" class="custom-input w-full h-10" />
      </div>

      <div>
        <label class="text-sm font-semibold">To</label>
        <input type="date" v-model="filters.to" class="custom-input w-full h-10" />
      </div>

      <div class="flex items-end">
        <button
          @click="getCases"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 w-full"
        >
          Apply Filters
        </button>
      </div>
    </div>
    <!-- ========================================== -->

    <!-- ================= TABLE ================= -->
    <div v-if="cases.length" class="overflow-hidden rounded-xl border border-primary mt-6 bg-white shadow-sm">
      <table class="min-w-full border border-primary">
        <thead class="bg-secondary text-white">
          <tr>
            <th class="px-6 py-3 border">Title</th>
            <th class="px-6 py-3 border">Type</th>
            <th class="px-6 py-3 border">Description</th>
            <th class="px-6 py-3 border">User</th>
            <th class="px-6 py-3 border">Created At</th>
            <th class="px-6 py-3 border">Updated At</th>
            <th class="px-6 py-3 border">Status</th>
            <th v-if="role === 'Admin'" class="px-6 py-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in cases" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 border font-semibold">{{ item.case_title }}</td>
            <td class="px-6 py-4 border">{{ item.case_type }}</td>
            <td class="px-6 py-4 border">{{ item.description }}</td>
            <td class="px-6 py-4 border">{{ item.User?.first_name }} {{ item.User?.last_name }}</td>
            <td class="px-6 py-4 border">{{ formatDate(item.createdAt) }}</td>
            <td class="px-6 py-4 border">{{ item.status === 'resolved' ? formatDate(item.updatedAt) : '---' }}</td>
            <td class="px-6 py-4 border">
              <span class="px-2 py-1 rounded-full text-white text-sm font-semibold"
                :class="{'bg-primary': item.status === 'pending','bg-green-600': item.status === 'resolved'}">
                {{ item.status }}
              </span>
            </td>
            <td v-if="role === 'Admin'" class="px-6 py-4 border text-center space-x-2">
              <button @click="editCase(item)" class="text-blue-500">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button @click="deleteCase(item.id)" class="text-red-500">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-500 mt-12">
      <i class="fa-solid fa-folder-open text-6xl mb-4"></i>
      <p>No cases found</p>
    </div>

    <!-- ================= MODAL ================= -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
        <button @click="closeModal" class="absolute right-4 top-4">✖</button>

        <h2 v-if="role === 'Admin'"  class="text-xl font-bold text-center text-primary mb-4">{{ isEditing ? 'Edit Case' : 'Create Case' }}</h2>

        <form @submit.prevent="isEditing ? updateCase() : createCase()">
          <div class="mb-3">
            <label>Case Type</label>
            <select v-model="form.case_type" class="custom-input w-full h-12">
              <option value="ussd">USSD</option>
              <option value="mobile_app">Mobile App</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Case Title</label>
            <input v-model="form.case_title" class="custom-input w-full h-12" />
          </div>

          <div class="mb-3">
            <label>Description</label>
            <textarea v-model="form.description" class="custom-input w-full"></textarea>
          </div>

          <div class="mb-3">
            <label>Status</label>
            <select v-model="form.status" class="custom-input w-full h-12">
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <button class="w-full h-12 bg-primary text-white rounded-lg">{{ isEditing ? 'Update Case' : 'Save Case' }}</button>
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
const role = ref(localStorage.getItem('role'))
const api = new ApiService();
const { proxy } = getCurrentInstance();

const cases = ref([]);

// ✅ Updated filters
const filters = ref({
  date_type: "", // "created" or "updated"
  from: "",
  to: ""
});

const showModal = ref(false);
const isEditing = ref(false);

const form = ref({
  id: null,
  case_type: "ussd",
  case_title: "",
  description: "",
  status: "pending"
});

const formatDate = (d) => new Date(d).toLocaleString();

// ✅ Updated getCases with proper params
const getCases = async () => {
  const params = {};

  if (filters.value.date_type === "created") {
    if (filters.value.from) params.created_from = filters.value.from;
    if (filters.value.to) params.created_to = filters.value.to;
  } else if (filters.value.date_type === "updated") {
    if (filters.value.from) params.updated_from = filters.value.from;
    if (filters.value.to) params.updated_to = filters.value.to;
  }

  try {
    const res = await api.get("/case", params,{headers: { 'Cache-Control': 'no-cache' }}); // ✅ ApiService wraps { params }
    
    cases.value = res.data || res.data || [];
  } catch (err) {
    console.error("Failed to fetch cases", err);
    cases.value = [];
  }
};

const createCase = async () => {
  await api.post("/case", form.value);
  proxy.$refs.toast.showSuccessToastMessage("Case created");
  closeModal();
  getCases();
};

const updateCase = async () => {
  await api.patch(`/case/${form.value.id}`, form.value);
  proxy.$refs.toast.showSuccessToastMessage("Case updated");
  closeModal();
  getCases();
};

const deleteCase = async (id) => {
  if (confirm("Are you sure?")) {
    await api.delete(`/case/${id}`);
    proxy.$refs.toast.showSuccessToastMessage("Case deleted");
    getCases();
  }
};

const editCase = (item) => {
  form.value = { ...item };
  isEditing.value = true;
  showModal.value = true;
};

const openModal = () => {
  isEditing.value = false;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    case_type: "ussd",
    case_title: "",
    description: "",
    status: "pending"
  };
};

onMounted(getCases);
</script>
