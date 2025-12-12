<template>
  <div class="min-h-screen bg-gray-50 ">
    <!-- Top Header -->
 
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10  gap-y-5 py-6 -mt-32">
      <!-- Quick Actions -->
      <div class="bg-white rounded-sm  shadow p-4">

        <Home />

        <div class="grid grid-cols-4 gap-2 mb-4" v-if="gg" >
          <button
            v-for="(action, index) in actions"
            :key="index"
            class="flex flex-col items-center justify-center p-2 rounded hover:bg-orange-50"
            :class="{ 'bg-orange-100 border border-orange-300': index === 0 }"
          >
            <i :class="action.icon" class="text-orange-500 text-xl"></i>
            <span class="text-sm mt-1">{{ action.label }}</span>
          </button>
        </div>
        <div class="space-y-2" v-if="hh">
          <button
            v-for="(option, idx) in transferOptions"
            :key="idx"
            class="w-full flex items-center justify-between p-3 bg-orange-50  hover:bg-orange-100"
          >
            <span>{{ option }}</span>
            <i class="fas fa-chevron-right text-gray-500"></i>
          </button>
        </div>
      </div>

      <!-- Transaction List -->
      <Transaction />

      <!-- Beneficiaries -->
      
      <div class="bg-white rounded-lg shadow p-4">
         <Beneficiary/>
        <!-- <h2 class="text-lg font-semibold mb-4">Beneficiary</h2>
        <div class="space-y-2">
          <div
            v-for="(ben, i) in beneficiaries"
            :key="i"
            class="p-3 bg-orange-50 rounded hover:bg-orange-100"
          >
            <div class="font-medium">{{ ben.name }}</div>
            <div class="text-sm text-gray-600">{{ ben.account }}</div>
          </div>
        </div>
        <button class="mt-3 text-blue-500 hover:underline">See More</button> -->
      </div>

      <!-- Advertisement -->
      <div class="bg-white rounded-lg shadow px-4 flex flex-col items-center justify-center">
        <Advertize />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Home from './home.vue'
import Advertize from "@/components/pages/Advertise.vue";
import Transaction from '@/views/protected/transaction/Transaction.vue'
import Beneficiary from './beneficiary/BeneficiaryView.vue'
const actions = [
  { label: 'Transfer', icon: 'fas fa-exchange-alt' },
  { label: 'Payment', icon: 'fas fa-credit-card' },
  { label: 'Top-up', icon: 'fas fa-plus' },
  { label: 'Other', icon: 'fas fa-ellipsis-h' },
]

const transferOptions = [
  'To Wegagen Bank Account',
  'To Other Bank Account',
  'To Telebirr Account',
  'To Non Accountholder',
]


const beneficiaries = [
  { name: 'Habtamu', account: '0800000000030101' },
  { name: 'Habtamu', account: '0800000000030101' },
  { name: 'Habtamu', account: '0800000000030101' },
  { name: 'Habtamu', account: '0800000000030101' },
]
</script>

<style scoped>
/* Optional: add any custom styles here */
</style>
