<template>
  <div class="bg-slate-50 min-h-screen p-4 md:p-8 font-sans text-slate-900">
    <div class="max-w-[1600px] mx-auto space-y-8">
      
      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-4 mb-1">
               <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                 <i class="fa-solid fa-users-gear text-lg"></i>
               </div>
               <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                 User <span class="text-primary font-light">Management</span>
               </h1>
            </div>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] ml-14">Access Control & Identity Provider</p>
          </div>

      <button
        @click="openModal()"
        class="group flex items-center bg-secondary text-white px-8 py-3.5 rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 hover:shadow-primary/30 active:scale-95"
      >
        <i class="fa-solid fa-user-plus mr-3 group-hover:rotate-12 transition-transform text-white"></i>
        <span class="text-xs font-black uppercase tracking-widest text-white">Add New Member</span>
      </button>
        </div>
      </div>

      <div class="rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email & Username</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Privilege</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
              </tr>
            </thead>

           <tbody class="divide-y divide-slate-50 bg-white">
          <tr 
            v-for="user in users" 
            :key="user.id"
            class="hover:bg-slate-50/80 transition-colors group"
          >
            <td class="px-8 py-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10 shadow-sm">
                  {{ user.first_name[0] }}{{ user.last_name[0] }}
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-700">{{ user.first_name }} {{ user.last_name }}</p>
                  <p class="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Registered Member</p>
                </div>
              </div>
            </td>

            <td class="px-8 py-5 text-sm">
              <p class="font-semibold text-slate-600">{{ user.email }}</p>
              <p class="text-xs text-slate-400 font-mono">@{{ user.username }}</p>
            </td>

            <td class="px-8 py-5">
              <span
                class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                :class="user.role === 'Admin' 
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                  : 'bg-slate-50 text-slate-500 border-slate-100'"
              >
                {{ user.role }}
              </span>
            </td>

            <td class="px-8 py-5">
              <div class="flex items-center gap-2">
                <span :class="user.status === 'Active' ? 'bg-emerald-500' : 'bg-orange-500'" class="w-2 h-2 rounded-full animate-pulse"></span>
                <span :class="user.status === 'Active' ? 'text-emerald-600' : 'text-orange-600'" class="text-xs font-black uppercase tracking-widest">
                  {{ user.status }}
                </span>
              </div>
            </td>

            <td class="px-8 py-5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button @click="editUser(user)" 
                  class="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100" 
                  title="Edit Profile">
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>

                <button 
                  v-if="user.status === 'Active'" 
                  @click="deactivateUser(user.id)" 
                  class="w-9 h-9 flex items-center justify-center bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm shadow-orange-100" 
                  title="Block User"
                >
                  <i class="fa-solid fa-user-slash text-xs"></i>
                </button>
                <button 
                  v-else 
                  @click="activateUser(user.id)" 
                  class="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100" 
                  title="Unblock User"
                >
                  <i class="fa-solid fa-user-check text-xs"></i>
                </button>

                <button @click="deleteUser(user.id)" 
                  class="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100" 
                  title="Delete Permanent">
                  <i class="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
          </table>
          <div v-if="users.length === 0 && !loading" class="py-20 text-center">
            <i class="fa-solid fa-user-group text-slate-200 text-5xl mb-4"></i>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">No members found</p>
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
        {{ isEditing ? 'Modify' : 'Register' }} <span class="text-primary font-light">Member</span>
      </h2>
      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Fill in account credentials</p>
    </div>

    <form @submit.prevent="isEditing ? updateUser() : createUser()" class="space-y-5">
      
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">First Name</label>
          <input v-model="form.first_name" type="text" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm text-slate-700" placeholder="First Name" required />
        </div>
        <div class="flex-1">
          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Last Name</label>
          <input v-model="form.last_name" type="text" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm text-slate-700" placeholder="Last Name" required />
        </div>
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
        <input v-model="form.email" type="email" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm text-slate-700" placeholder="FullName@Wegagenbabksc.com.et" required />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Username</label>
        <input v-model="form.username" type="text" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm text-slate-700" placeholder="Username" required />
      </div>

      <div v-if="!isEditing">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Secure Password</label>
        <input v-model="form.password" type="password" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm text-slate-700" placeholder="••••••••" required />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1 block">System Role</label>
        <select v-model="form.role" class="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-xs uppercase tracking-widest text-slate-700 cursor-pointer">
          <option value="Admin">Administrator</option>
          <option value="User">Standard User</option>
        </select>
      </div>

      <button 
        type="submit"
        class="w-full h-14 bg-secondary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-3 active:scale-95 group"
      >
        <i :class="isEditing ? 'fa-solid fa-pen-to-square' : 'fa-solid fa-cloud-arrow-up'" class="text-white group-hover:scale-110 transition-transform"></i>
        <span class="text-white">
          {{ isEditing ? 'Update Profile' : 'Complete Registration' }}
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
import { ref, getCurrentInstance, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import Toast from "../../components/reUsableComponents/Toast.vue";

/* Logic remains exactly the same as provided */
const showModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();
const api = new ApiService();
const users = ref([]);

const form = ref({
  id: null,
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  password: "",
  role: "User",
});

const openModal = () => {
  showModal.value = true;
  isEditing.value = false;
};

const closeModal = () => {
  showModal.value = false;
  form.value = { id: null, first_name: "", last_name: "", email: "", username: "", password: "", role: "User" };
};

const getAllUsers = async () => {
  try {
    loading.value = true;
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    loading.value = false;
  }
};

const createUser = async () => {
  try {
    await api.post("/auth/register", form.value);
    proxy.$refs.toast.showSuccessToastMessage("User registered successfully!");
    getAllUsers();
    closeModal();
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Registration failed");
  }
};

const editUser = (user) => {
  form.value = { ...user, password: "" };
  isEditing.value = true;
  showModal.value = true;
};

const updateUser = async () => {
  try {
    await api.patch(`/users/${form.value.id}`, form.value);
    proxy.$refs.toast.showSuccessToastMessage("Profile updated!");
    getAllUsers();
    closeModal();
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Update failed");
  }
};

const deleteUser = async (id) => {
  if (confirm("Delete this member permanently?")) {
    try {
      await api.delete(`/users/${id}`);
      proxy.$refs.toast.showSuccessToastMessage("User removed");
      getAllUsers();
    } catch (err) {
      proxy.$refs.toast.showErrorToastMessage("Action failed");
    }
  }
};

const deactivateUser = async (id) => {
  if (!confirm("Deactivate this user?")) return;
  try {
    await api.patch(`/users/${id}/deactivate`);
    proxy.$refs.toast.showSuccessToastMessage("Access Revoked");
    getAllUsers();
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Action failed");
  }
};

const activateUser = async (id) => {
  if (!confirm("Activate this user?")) return;
  try {
    await api.patch(`/users/${id}/activate`);
    proxy.$refs.toast.showSuccessToastMessage("Access Granted");
    getAllUsers();
  } catch (err) {
    proxy.$refs.toast.showErrorToastMessage("Action failed");
  }
};

onMounted(() => {
  getAllUsers();
});
</script>

<style scoped>
/* Smooth fade for the action buttons */
.divide-y tr:hover .group-hover\:opacity-100 {
  transition-delay: 50ms;
}
</style>