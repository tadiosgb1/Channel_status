<template>
  <div class="px-6 py-8 bg-white min-h-screen text-slate-800 font-sans" ref="reportRef">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 pb-6 border-b-2 border-primary/10">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-primary">Channel Status Update</h1>
        <p class="text-slate-500 mt-1 flex items-center gap-2 text-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Report: <span class="font-bold text-secondary">{{ formatDate(report.datecheck) }}</span> 
          <span class="text-slate-300 mx-2">—</span> 
          <span class="font-bold text-secondary">{{ formatDate(getDate) }}</span>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="getReport" class="px-5 py-2.5 bg-secondary text-white font-bold rounded-xl transition hover:opacity-90 shadow-lg shadow-secondary/20 text-sm uppercase tracking-wider">
          Refresh Data
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col justify-center items-center h-64">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <span class="mt-4 text-tertiary font-bold tracking-widest uppercase text-xs">Synchronizing...</span>
    </div>

    <div v-else class="space-y-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div class="bg-white border-t-4 border-primary rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-primary/5">
          <div class="p-6 flex justify-between items-center bg-primary/[0.03]">
            <div>
              <h2 class="text-xs font-black text-primary uppercase tracking-[0.2em]">Mobile App</h2>
              <p class="text-4xl font-black text-slate-900 mt-1 italic">
                {{ report.app_count || 0 }} <span class="text-xs text-slate-400 font-bold not-italic uppercase tracking-normal">Users</span>
              </p>
            </div>
            <button @click="showAppModal = true" class="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div class="overflow-x-auto p-4">
            <table class="w-full text-left text-sm">
              <thead class="text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Operation</th>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-right">Amount</th>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="op in mobileAppOps" :key="op.name" class="group hover:bg-primary/[0.02]">
                  <td class="px-4 py-4 font-bold text-slate-700 group-hover:text-primary transition-colors">{{ op.name }}</td>
                  <td class="px-4 py-4 font-mono text-right text-slate-900 font-black">{{ formatNumber(op.sum) }}</td>
                  <td class="px-4 py-4 text-center">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[10px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> UP
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white border-t-4 border-secondary rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-xl hover:shadow-secondary/5">
          <div class="p-6 flex justify-between items-center bg-secondary/[0.03]">
            <div>
              <h2 class="text-xs font-black text-secondary uppercase tracking-[0.2em]">USSD Channel</h2>
              <p class="text-4xl font-black text-slate-900 mt-1 italic">
                {{ report.ussd_count || 0 }} <span class="text-xs text-slate-400 font-bold not-italic uppercase tracking-normal">Users</span>
              </p>
            </div>
            <button @click="showUssdModal = true" class="p-4 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/30 hover:-translate-y-1 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
          <div class="overflow-x-auto p-4">
            <table class="w-full text-left text-sm">
              <thead class="text-slate-400">
                <tr>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Operation</th>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-right">Amount</th>
                  <th class="px-4 py-3 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="op in ussdOps" :key="op.name" class="group hover:bg-secondary/[0.02]">
                  <td class="px-4 py-4 font-bold text-slate-700 group-hover:text-secondary transition-colors">{{ op.name }}</td>
                  <td class="px-4 py-4 font-mono text-right text-slate-900 font-black">{{ formatNumber(op.sum) }}</td>
                  <td class="px-4 py-4 text-center">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[10px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> UP
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bg-tertiary rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-6">
            <div class="p-5 bg-white text-tertiary rounded-[1.5rem] shadow-xl shadow-black/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p class="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-1">Internal Transfer Sum</p>
              <h3 class="text-secondary text-2xl font-black uppercase italic">Consolidated Channel View</h3>
            </div>
          </div>
          
          <div class="bg-black/10 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/10 flex items-baseline gap-6">
             <p class="text-blacktext-[10px] font-bold uppercase tracking-widest">Total Amount</p>
             <p class="text-5xl font-mono font-black text-black tracking-tighter">{{ formatNumber(internalTransfer.sum) }}</p>
          </div>

          <div class="flex flex-col items-center md:items-end">
             <div class="bg-white px-4 py-1 rounded-full text-[10px] font-black text-tertiary tracking-widest uppercase mb-3">
              Operational
             </div>
             <p class="text-black/40 text-[9px] font-mono tracking-tighter">AUTHENTICATED SECURE SESSION</p>
          </div>
        </div>
      </div>
    </div>
    
    <AppDataModal v-if="showAppModal" :date="formattedDate" @close="showAppModal = false" />
    <UssdDataModal v-if="showUssdModal" :report="report" @close="showUssdModal = false" />
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
