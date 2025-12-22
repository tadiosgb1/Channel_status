<template>
  <div class="px-6 bg-gray-100 min-h-screen space-y-4"  ref="reportRef">
    <!-- Header -->
    <div class="bg-primary/20 border-l-4 border-primary p-6 rounded-xl shadow-md">
      <h1 class="text-3xl font-semi ">Channel Status Update</h1>
     <div class="flex justify-between">
       <p class=" font-semibold mt-1">
        Report from: <span class="text-primary">{{ formatDate(report.datecheck) }}</span> <span class="text-green-500">--</span> <span class="text-[#0f3c50]">{{ formatDate(getDate) }}</span>
      </p>
      <!-- <button 
        @click="copyPage"
        class="mb-4 px-4 py-2 bg-primary text-white rounded-lg shadow"
      >
        Copy Report
      </button> -->
     </div>
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
<div class="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
  <table class="min-w-full border-collapse bg-white">
      <thead class="bg-secondary text-white">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Channel</th>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Total Users</th>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Operation</th>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Transactions</th>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Amount</th>
          <th class="px-4 py-3 text-left text-sm font-medium uppercase border border-primary">Status</th>
        </tr>
      </thead>

      <tbody class="bg-white">

        <!-- MOBILE APP -->
        <tr v-for="(op, index) in mobileAppOps" :key="'m-' + index">
          <td v-if="index === 0"
              :rowspan="mobileAppOps.length"
              class="px-0 py-2 font-semibold border border-primary">
             <button
              @click="showAppModal = true"
              class="hover:bg-primary hover:text-white h-32 w-full rounded-lg transition bg-gray-200 "
            >
              Mobile App
            </button>
          </td>

          <td v-if="index === 0"
              :rowspan="mobileAppOps.length"
              class="px-4 py-2 font-semibold border border-primary">
            {{ report.app_count }}
          </td>

          <td class="px-4 py-2 border border-primary">{{ op.name }}</td>
          <td class="px-4 py-2 border border-primary">{{ op.count }}</td>
          <td class="px-4 py-2 border border-primary">{{ formatNumber(op.sum) }}</td>
          <td class="px-4 py-2 border border-primary text-green-600 font-semibold">{{ op.status }}</td>
        </tr>

        <!-- USSD -->
        <tr v-for="(op, index) in ussdOps" :key="'u-' + index">
          <td v-if="index === 0"
              :rowspan="ussdOps.length"
              class="px-0 py-2 font-semibold border border-primary">
              <button
                @click="showUssdModal = true"
                class="hover:bg-primary hover:text-white h-32 w-full rounded-lg transition bg-gray-200 "
              >
                USSD
              </button>

          </td>

          <td v-if="index === 0"
              :rowspan="ussdOps.length"
              class="px-4 py-2 font-semibold border border-primary">
            {{ report.ussd_count }}
          </td>

          <td class="px-4 py-2 border border-primary">{{ op.name }}</td>
          <td class="px-4 py-2 border border-primary">{{ op.count }}</td>
          <td class="px-4 py-2 border border-primary">{{ formatNumber(op.sum) }}</td>
          <td class="px-4 py-2 border border-primary text-green-600 font-semibold">{{ op.status }}</td>
        </tr>

        <!-- INTERNAL TRANSFER -->
        <tr>
          <td class="px-4 py-2 font-semibold border border-primary">USSD + Mobile</td>
          <td class="px-4 py-2 border border-primary">-</td>
          <td class="px-4 py-2 border border-primary">Internal Transfer</td>
          <td class="px-4 py-2 border border-primary">{{ internalTransfer.count }}</td>
          <td class="px-4 py-2 border border-primary">{{ formatNumber(internalTransfer.sum) }}</td>
          <td class="px-4 py-2 border border-primary text-green-600 font-semibold">UP</td>
        </tr>

        <!-- INTERNET/OBDX -->
        <tr>
          <td class="px-4 py-2 font-semibold border border-primary">Internet/OBDX</td>
          <td class="px-4 py-2 border border-primary" colspan="5"></td>
        </tr>
      </tbody>
    </table>

    <AppDataModal
      v-if="showAppModal"
      :date="formattedDate"
      @close="showAppModal = false"
    />


      <UssdDataModal
        v-if="showUssdModal"
        :report="report"
        @close="showUssdModal = false"
      />


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import AppDataModal from "@/views/protected/AppDataModal.vue";
import UssdDataModal from "@/views/protected/UssdDataModal.vue";
const showAppModal = ref(false);
const showUssdModal = ref(false);

const loading = ref(true);
const report = ref({});
const reportRef = ref(null);

const mobileAppOps = ref([]);
const ussdOps = ref([]);
const internalTransfer = ref({ count: 0, sum: 0 });

const api = new ApiService();
const eror=ref(null);

const getDate = new Date();
const formattedDate = getDate.toISOString().split("T")[0];    

/* Convert "1,234,567.89" → 1234567.89 */
const toNumber = (val) => {
  if (!val) return 0;
  return parseFloat(String(val).replace(/,/g, ""));
};

/* Format number back to commas */
const formatNumber = (num) => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};




const copyPage = async () => {
  const htmlContent = reportRef.value.outerHTML; // or innerHTML
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([htmlContent], { type: "text/html" }),
      "text/plain": new Blob([reportRef.value.innerText], { type: "text/plain" }),
    }),
  ]);
  alert("Report copied with formatting!");
};


// const mobileAppData = ref([]);
// const ussdData = ref([]);

// const getUssdAppData = async () => {
//   try {
//     const res = await api.get("/cron_local_report/app/report ");
//     ussdData.value = res.data;
//   } catch (err) {
//     console.error("Error fetching USSD app data:", err);
//   }
// };

// const getMobileAppData = async () => {
//   try {
//     const res = await api.get("/mobile_app_users");
//     mobileAppData.value = res.data;
//   } catch (err) {
//     console.error("Error fetching mobile app data:", err);
//   }
// };

const getReport = async () => {
  try {
    loading.value = true;
    const res = await api.get("/cron_local_report");
    report.value = res.data;

    // MOBILE APP ops
    mobileAppOps.value = [
      { name: "To Other Bank", count: report.value.m_to_other_bank_count, sum: toNumber(report.value.m_to_other_bank_sum), status: "UP" },
      { name: "TopUp", count: report.value.m_topup_count, sum: toNumber(report.value.m_topup_sum), status: "UP" },
      { name: "Tele Birr", count: report.value.m_telebirr_count, sum: toNumber(report.value.m_telebirr_sum), status: "UP" },
      { name: "Payments", count: report.value.m_payment_count, sum: toNumber(report.value.m_payment_sum), status: "UP" },
      { name: "QR", count: report.value.m_qr_count, sum: toNumber(report.value.m_qr_sum), status: "UP" },
    ];

    // USSD ops
    ussdOps.value = [
      { name: "To Other Bank", count: report.value.u_to_other_bank_count, sum: toNumber(report.value.u_to_other_bank_sum), status: "UP" },
      { name: "TopUp", count: report.value.u_topup_count, sum: toNumber(report.value.u_topup_sum), status: "UP" },
      { name: "Tele Birr", count: report.value.u_telebirr_count, sum: toNumber(report.value.u_telebirr_sum), status: "UP" },
      { name: "Payments", count: report.value.u_payment_count, sum: toNumber(report.value.u_payment_sum), status: "UP" },
    ];

    // INTERNAL TRANSFER (Mobile + USSD)
    internalTransfer.value = {
      count:
        toNumber(report.value.m_to_wegagen_bank_count) +
        toNumber(report.value.u_to_wegagen_bank_count),

      sum:
        toNumber(report.value.m_to_wegagen_bank_sum) +
        toNumber(report.value.u_to_wegagen_bank_sum),
    };

  } catch (err) {
    loading.value = false;
     eror.value=err.response.data.message || "An error occurred";
    console.error("Error fetching report:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(getReport);

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};
</script>
