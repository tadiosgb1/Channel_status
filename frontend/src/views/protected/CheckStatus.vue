<template>
  <div class="p-6 bg-gray-100 min-h-screen space-y-6">

    <!-- Header -->
   <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md mb-6">
      <h1 class="text-3xl font-extrabold text-primary mb-2">Daily Channel Update</h1>
      <p class="text-primary font-semibold mt-1">
        <!-- Report from: {{ formatDate(report.datecheck) }} -->
      </p>
    </div>

       <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <svg class="animate-spin h-18 w-18 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span class="ml-2 text-gray-500 font-semibold">Loading Reports...</span>
    </div>

    <!-- Channels Table -->
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Channel</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Total Users</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Operation</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Transactions</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Amount</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Mobile App -->
          <tr v-for="(op, index) in mobileAppOps" :key="'m-'+index" class="hover:bg-gray-50 transition">
            <td
              v-if="index === 0"
              :rowspan="mobileAppOps.length"
              class="px-4 py-2 font-semibold"
            >
              Mobile App
            </td>
            <td
              v-if="index === 0"
              :rowspan="mobileAppOps.length"
              class="px-4 py-2 font-semibold"
            >
              {{ report.app_count }}
            </td>
            <td class="px-4 py-2">{{ op.name }}</td>
            <td class="px-4 py-2">{{ op.count }}</td>
            <td class="px-4 py-2">{{ op.sum }}</td>
            <td class="px-4 py-2 text-green-600 font-semibold">{{ op.status }}</td>
          </tr>

          <!-- USSD -->
          <tr v-for="(op, index) in ussdOps" :key="'u-'+index" class="hover:bg-gray-50 transition">
            <td
              v-if="index === 0"
              :rowspan="ussdOps.length"
              class="px-4 py-2 font-semibold"
            >
              USSD
            </td>
            <td
              v-if="index === 0"
              :rowspan="ussdOps.length"
              class="px-4 py-2 font-semibold"
            >
              {{ report.ussd_count }}
            </td>
            <td class="px-4 py-2">{{ op.name }}</td>
            <td class="px-4 py-2">{{ op.count }}</td>
            <td class="px-4 py-2">{{ op.sum }}</td>
            <td class="px-4 py-2 text-green-600 font-semibold">{{ op.status }}</td>
          </tr>

          <!-- Internal Transfer -->
          <tr>
            <td class="px-4 py-2 font-semibold">USSD + Mobile</td>
            <td class="px-4 py-2">-</td>
            <td class="px-4 py-2">Internal Transfer</td>
            <td class="px-4 py-2">{{ internalTransfer.count }}</td>
            <td class="px-4 py-2">{{ internalTransfer.sum }}</td>
            <td class="px-4 py-2 text-green-600 font-semibold">UP</td>
          </tr>

          <!-- Internet / OBDX -->
          <tr>
            <td class="px-4 py-2 font-semibold">Internet/OBDX</td>
            <td class="px-4 py-2" colspan="5"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Execution Time Card -->


  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/services/ApiService";
const loading = ref(true);
const report = ref({
  datecheck: '',
  app_count: 0,
  ussd_count: 0,
  m_to_other_bank_count: 0,
  m_to_other_bank_sum: 0,
  m_topup_count: 0,
  m_topup_sum: 0,
  m_telebirr_count: 0,
  m_telebirr_sum: 0,
  m_payment_count: 0,
  m_payment_sum: 0,
  m_qr_count: 0,
  m_qr_sum: 0,
  u_to_other_bank_count: 0,
  u_to_other_bank_sum: 0,
  u_topup_count: 0,
  u_topup_sum: 0,
  u_telebirr_count: 0,
  u_telebirr_sum: 0,
  u_payment_count: 0,
  u_payment_sum: 0,
  u_to_wegagen_bank_count: 0,
  u_to_wegagen_bank_sum: 0,
  m_to_wegagen_bank_count: 0,
  m_to_wegagen_bank_sum: 0,
  ExecutionTime: 0,
  individualExecutionTime: {}
});

const api = new ApiService();

const mobileAppOps = ref([]);
const ussdOps = ref([]);
const internalTransfer = ref({ count: 0, sum: 0 });

const getReport = async () => {
  try {
      loading.value = true  ;
    const res = await api.get("/reports/report");
    report.value = res.data;

    mobileAppOps.value = [
      { name: "To Other Bank", count: report.value.m_to_other_bank_count, sum: report.value.m_to_other_bank_sum, status: "UP" },
      { name: "TopUp", count: report.value.m_topup_count, sum: report.value.m_topup_sum, status: "UP" },
      { name: "Tele Birr", count: report.value.m_telebirr_count, sum: report.value.m_telebirr_sum, status: "UP" },
      { name: "Payments", count: report.value.m_payment_count, sum: report.value.m_payment_sum, status: "UP" },
      { name: "QR", count: report.value.m_qr_count, sum: report.value.m_qr_sum, status: "UP" }
    ];

    ussdOps.value = [
      { name: "To Other Bank", count: report.value.u_to_other_bank_count, sum: report.value.u_to_other_bank_sum, status: "UP" },
      { name: "TopUp", count: report.value.u_topup_count, sum: report.value.u_topup_sum, status: "UP" },
      { name: "Tele Birr", count: report.value.u_telebirr_count, sum: report.value.u_telebirr_sum, status: "UP" },
      { name: "Payments", count: report.value.u_payment_count, sum: report.value.u_payment_sum, status: "UP" }
    ];

    internalTransfer.value = {
      count: report.value.m_to_wegagen_bank_count + report.value.u_to_wegagen_bank_count,
      sum: report.value.m_to_wegagen_bank_sum + report.value.u_to_wegagen_bank_sum
    };
    if (loading.value) {
        loading.value = false;
    }

  } catch (err) {
    console.error("Error fetching report:", err);
  }
};

onMounted(getReport);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};
</script>
