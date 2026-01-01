<template>
  <div class="bg-slate-50 min-h-screen p-4 md:p-8 font-sans text-slate-900">
    <div class="max-w-[1600px] mx-auto space-y-8">
      
      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-4 mb-1">
              <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                <i class="fa-solid fa-briefcase text-lg"></i>
              </div>
              <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                Case <span class="text-primary font-light">Management</span>
              </h1>
            </div>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] ml-14">Issue Tracking & Resolution</p>
          </div>

          <button
            v-if="role === 'Admin'"
            @click="openModal()"
            class="group flex items-center bg-secondary text-white px-8 py-3.5 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 hover:shadow-primary/30 active:scale-95"
          >
            <i class="fa-solid fa-plus mr-3 group-hover:rotate-90 transition-transform text-white"></i>
            <span class="text-xs font-black uppercase tracking-widest text-white">Create New Case</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-[1.5rem] border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Type</label>
          <select v-model="filters.date_type" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs uppercase tracking-widest">
            <option value="">Select Type</option>
            <option value="created">Created Date</option>
            <option value="updated">Updated Date</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
          <input type="date" v-model="filters.from" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
          <input type="date" v-model="filters.to" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs" />
        </div>

        <button
          @click="getCases"
          class="h-12 bg-secondary text-white hover:bg-primary hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 border border-slate-200 shadow-sm"
        >
          Apply Filters
        </button>
      </div>

      <div class="rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Case Details</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assigned User</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timeline</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
                <th v-if="role === 'Admin'" class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in cases" :key="item.id" class="hover:bg-slate-50/80 transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-[10px] border border-primary/10 shadow-sm">
                      {{ item.case_type === 'ussd' ? 'USSD' : 'APP' }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-700">{{ item.case_title }}</p>
                      <p class="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{{ item.case_type }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-8 py-5">
                  <p class="text-xs text-slate-500 max-w-xs line-clamp-2 leading-relaxed">{{ item.description }}</p>
                </td>

                <td class="px-8 py-5">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200">
                      {{ item.User?.first_name[0] }}{{ item.User?.last_name[0] }}
                    </div>
                    <span class="text-xs font-semibold text-slate-600">{{ item.User?.first_name }} {{ item.User?.last_name }}</span>
                  </div>
                </td>

                <td class="px-8 py-5">
                  <p class="text-[10px] font-bold text-slate-500 uppercase">Created: {{ formatDate(item.createdAt) }}</p>
                  <p class="text-[10px] font-medium text-slate-400 mt-0.5 italic">Resolved: {{ item.status === 'resolved' ? formatDate(item.updatedAt) : 'N/A' }}</p>
                </td>

                <td class="px-8 py-5 text-center">
                  <span
                    class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                    :class="item.status === 'resolved' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-orange-50 text-orange-600 border-orange-100'"
                  >
                    {{ item.status }}
                  </span>
                </td>

                <td v-if="role === 'Admin'" class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button @click="editCase(item)" class="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button @click="deleteCase(item.id)" class="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                      <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="cases.length === 0" class="py-20 text-center">
            <i class="fa-solid fa-folder-open text-slate-200 text-5xl mb-4"></i>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">No cases found</p>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative p-10 text-slate-900">
          
          <button @click="closeModal" class="absolute right-6 top-6 text-slate-400 hover:text-red-500 transition-colors">
            <i class="fa-solid fa-circle-xmark text-2xl"></i>
          </button>

          <div class="text-center mb-8">
            <h2 class="text-2xl font-black text-slate-800 uppercase italic tracking-tight">
              {{ isEditing ? 'Modify' : 'Create' }} <span class="text-primary font-light">Case</span>
            </h2>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Fill in issue details</p>
          </div>

          <form @submit.prevent="isEditing ? updateCase() : createCase()" class="space-y-5">
            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Case Type</label>
              <select v-model="form.case_type" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs uppercase tracking-widest text-slate-700 cursor-pointer">
                <option value="ussd">USSD Service</option>
                <option value="mobile_app">Mobile Application</option>
              </select>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Case Title</label>
              <input v-model="form.case_title" type="text" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-slate-700" placeholder="e.g., USSD Login Failure" required />
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-slate-700 resize-none" placeholder="Detailed explanation..."></textarea>
            </div>

            <div>
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Resolution Status</label>
              <select v-model="form.status" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs uppercase tracking-widest text-slate-700 cursor-pointer">
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <button 
              type="submit"
              class="w-full h-14 bg-secondary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-save'" class="text-white group-hover:scale-110 transition-transform"></i>
              <span class="text-white">
                {{ isEditing ? 'Update Case' : 'Register Case' }}
              </span>
            </button>
          </form>
        </div>
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
