<template>
  <div class="lg:hidden fixed top-0 left-0  right-0 bg-white/80 backdrop-blur-md border-b border-tertiary z-50 flex items-center justify-between px-6 h-16">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30">
        <i class="fa-solid fa-layer-group text-xs"></i>
      </div>
      <span class="font-black text-secondary uppercase tracking-tighter italic">Wegagen <span class="text-primary font-light">Report</span></span>
    </div>
    <button @click="toggleSidebar" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-primary border border-tertiary active:scale-90 transition-all">
      <i class="fa-solid" :class="isOpen ? 'fa-xmark' : 'fa-bars-staggered'"></i>
    </button>
  </div>

  <transition name="fade">
    <div v-if="isOpen" @click="toggleSidebar" class="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 lg:hidden"></div>
  </transition>

  <aside
    class="w-72 bg-white border-r border-tertiary h-screen fixed shadow-2xl lg:shadow-none z-50 transform transition-all duration-500 ease-in-out flex flex-col"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full', 'lg:translate-x-0']"
  >
    <div class="p-8">
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:bg-secondary transition-all duration-500 rotate-3 group-hover:rotate-0">
          <i class="fa-solid fa-landmark-flag text-xl"></i>
        </div>
        <div>
          <h1 class="text-xl font-black text-secondary uppercase tracking-tighter leading-none italic">
            Wegagen <br><span class="text-primary font-light tracking-widest text-[10px] uppercase italic">System Portal</span>
          </h1>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-8 overflow-y-auto mt-4">
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-4">Main Menu</p>
        <ul class="space-y-2">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink
              v-if="!link.adminOnly || role === 'Admin'"
              :to="{ name: link.to }"
              @click="closeOnMobile"
              class="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative overflow-hidden"
              :class="isActive(link.to) ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-slate-500 hover:bg-tertiary/30 hover:text-secondary'"
            >
              <div class="flex items-center relative z-10">
                <span class="w-8 flex justify-center text-lg group-hover:scale-110 transition-transform" :class="isActive(link.to) ? 'text-primary' : 'text-slate-400 group-hover:text-primary'">
                  <i :class="link.icon"></i>
                </span>
                <span class="ml-3 text-xs font-black uppercase tracking-widest">{{ link.label }}</span>
              </div>

              <span v-if="link.to === 'cases' && pendingCount > 0" 
                class="relative z-10 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-primary/40 animate-pulse">
                {{ pendingCount }}
              </span>

              <div v-if="isActive(link.to)" class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-l-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="p-6 border-t border-tertiary bg-slate-50/50">
      <div class="flex items-center gap-3 p-2 bg-white rounded-2xl shadow-sm border border-tertiary">
        <div class="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-black text-xs shadow-inner">
          {{ role === 'Admin' ? 'AD' : 'US' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black text-secondary uppercase truncate leading-none">Wegagen Staff</p>
          <p class="text-[9px] font-bold text-primary uppercase tracking-tighter mt-1">{{ role }} Access</p>
        </div>
        <button class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <i class="fa-solid fa-power-off text-sm"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ApiService from '@/services/ApiService'

const role = ref(localStorage.getItem('role'))
const route = useRoute()
const isOpen = ref(false)
const pendingCount = ref(0)
const api = new ApiService()

const navLinks = [
  { label: 'Dashboard', to: 'dashboard', icon: 'fa-solid fa-gauge-high', adminOnly: false },
  { label: 'Chanel Status', to: 'check-status', icon: 'fa-solid fa-chart-pie', adminOnly: false },
  { label: 'Users', to: 'create-users', icon: 'fa-solid fa-user-shield', adminOnly: true },
  { label: 'Cases', to: 'cases', icon: 'fa-solid fa-briefcase', adminOnly: false },
]

const toggleSidebar = () => isOpen.value = !isOpen.value
const closeOnMobile = () => { if (window.innerWidth < 1024) isOpen.value = false }
const isActive = (name) => route.name === name

const getPendingCasesCount = async () => {
  try {
    const res = await api.get('/case')
    pendingCount.value = res.data.filter(c => c.status?.toLowerCase() === 'pending').length
  } catch (err) {
    console.error('Count fetch failed', err)
  }
}

onMounted(getPendingCasesCount)
</script>

<style scoped>
/* Transition for Sidebar mobile */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Custom Scrollbar for the Nav */
nav::-webkit-scrollbar { width: 4px; }
nav::-webkit-scrollbar-track { background: transparent; }
nav::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>