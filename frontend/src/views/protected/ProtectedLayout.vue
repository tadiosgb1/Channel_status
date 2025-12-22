<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 lg:ml-64">

      <!-- Mobile Top Bar Spacer -->
      <div class="lg:hidden h-14"></div>

      <!-- Header Card -->
      <header class="mb-2 flex justify-between items-center bg-white p-6 rounded-xl shadow-md">

        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <img
            :src="user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.first_name || 'User')"
            alt="Avatar"
            class="w-14 h-14 rounded-full border-2 border-primary object-cover"
          />
          <div>
            <h2 class="text-2xl font-bold text-white">
              Welcome, {{ user.first_name }}
            </h2>
            <p class="text-gray-500 text-sm capitalize">
              Logged in as: {{ user?.role || 'Admin' }}
            </p>
          </div>
        </div>

        <!-- 🔴 User Dropdown -->
        <div class="relative">
          <button
            @click.stop="toggleDropdown"
            class="text-primary hover:text-primary/80 text-3xl p-2 rounded-full hover:bg-primary/10 transition"
            title="Account Actions"
          >
            <i class="fa-solid fa-user-gear"></i>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border z-50"
          >
            <button
              @click="openChangePassword"
              class="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <i class="fa-solid fa-key text-primary"></i>
              Change Password
            </button>

            <button
              @click="openLogoutModal"
              class="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-gray-100"
            >
              <i class="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </div>

      </header>

      <!-- Nested Routes -->
      <main class="p-6">
        <router-view />
      </main>

      <!-- 🔴 Change Password Modal -->
      <ChangePasswordModal
        v-if="showChangePassword"
        @close="showChangePassword = false"
      />

      <!-- 🔴 Logout Confirmation Modal -->
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative border-t-4 border-primary">

          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
            @click="showLogoutModal = false"
          >
            ✖️
          </button>

          <h2 class="text-2xl font-bold text-center mb-4 text-gray-800 flex justify-center items-center space-x-2">
            <i class="fa-solid fa-right-from-bracket text-primary"></i>
            <span>Confirm Logout</span>
          </h2>

          <p class="text-gray-600 text-center mb-6">
            Are you sure you want to log out from your account?
          </p>

          <div class="flex justify-center gap-4">
            <button
              @click="showLogoutModal = false"
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              @click="logout"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
            >
              Yes, Logout
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layouts/Sidebar.vue'
import ChangePasswordModal from '@/components/modals/ChangePasswordModal.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ApiService from "@/services/ApiService"

const router = useRouter()
const apiService = new ApiService()


const showDropdown = ref(false)
const showLogoutModal = ref(false)
const showChangePassword = ref(false)

const user = ref({
  first_name: 'Admin',
  role: 'Admin',
  avatar: ''
})


onMounted(() => {
  const firstName = localStorage.getItem('first_name')
  const role = localStorage.getItem('role')
  const avatar = localStorage.getItem('avatar')

  if (firstName) {
    user.value.first_name = firstName
    user.value.role = role || 'Admin'
    user.value.avatar = avatar || ''
  }

  document.addEventListener('click', handleClickOutside)
})


const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const openChangePassword = () => {
  showDropdown.value = false
  showChangePassword.value = true
}

const openLogoutModal = () => {
  showDropdown.value = false
  showLogoutModal.value = true
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showDropdown.value = false
  }
}


const logout = async () => {
  await apiService.post('/auth/logout').catch(() => {})

  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('first_name')
  localStorage.removeItem('role')
  localStorage.removeItem('avatar')
  localStorage.removeItem('id')

  router.push('/login')
}
</script>
