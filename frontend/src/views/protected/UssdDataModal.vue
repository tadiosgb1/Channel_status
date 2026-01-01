<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative">
      
      <div class="absolute -top-24 -left-24 w-64 h-64  bg-primary/10  rounded-full blur-[80px] pointer-events-none"></div>

      <div class="relative px-10 pt-10 pb-6 flex justify-between items-center">
        <div>
          <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12  bg-primary/10  rounded-2xl flex items-center justify-center text-primary shadow-sm">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6M9 11h6M9 15h3" />
              </svg>
            </div>
            <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase">
              USSD Channel <span class="text-indigo-500 font-light">—</span> Daily Report
            </h2>
          </div>
          <p class="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase ml-16">Real-time USSD Session Analytics</p>
        </div>
        
        <button @click="$emit('close')" class="group bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-3 rounded-2xl transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="h-[520px] flex flex-col items-center justify-center bg-slate-50/50">
        <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-bold tracking-widest uppercase animate-pulse">Processing USSD Logs...</p>
      </div>

      <div v-else-if="error" class="h-[520px] flex items-center justify-center">
        <div class="bg-red-50 border border-red-100 p-10 rounded-[2rem] text-center max-w-md">
          <p class="text-red-600 font-bold mb-4">{{ error }}</p>
          <button @click="fetchUssdReport" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black uppercase tracking-widest transition-all">Retry Fetch</button>
        </div>
      </div>

      <div v-else class="relative px-10 pb-10">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto">
            <button 
              @click="tab = 'count'" 
              :class="tab === 'count' ? 'bg-white text-primary shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
              class="flex-1 md:flex-none px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              Tx Counts
            </button>
            <button 
              @click="tab = 'amount'" 
              :class="tab === 'amount' ? 'bg-white text-primary shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
              class="flex-1 md:flex-none px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
            >
              Amounts
            </button>
          </div>

          <div class="flex items-center gap-2 bg-slate-800 p-1.5 rounded-full shadow-lg">
            <button
              @click="timeRange = 'day'"
              :class="timeRange === 'day' ? 'bg-yellow-400 text-slate-900 shadow-sm' : 'text-white/40 hover:text-white'"
              class="p-2.5 rounded-full transition-all"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
            </button>
            <button
              @click="timeRange = 'night'"
              :class="timeRange === 'night' ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/40 hover:text-white'"
              class="p-2.5 rounded-full transition-all"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
            </button>
          </div>
        </div>

        <div class="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 shadow-inner">
          <apexchart
            v-if="tab === 'count'"
            type="bar"
            height="460"
            :options="countOptions"
            :series="countSeries"
          />
          <apexchart
            v-else
            type="bar"
            height="460"
            :options="amountOptions"
            :series="amountSeries"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;

/* Props */
const props = defineProps({
  date: { type: String, default: null },
});

/* State */
const loading = ref(false);
const error = ref(null);
const tab = ref("count");
const timeRange = ref("day"); 
const raw = ref({ hours: [], series: {} });
const api = new ApiService();

/* Chart Colors */
const colors = ["#4F46E5", "#10B981", "#EF4444", "#F59E0B",  "#8B5CF6", "#14B8A6"];

/* Formatting Helpers */
const labelName = (key) => {
  if (key === "ussd_count") return "Total USSD Users";
  return key.replace(/^u_/, "").replace(/_count|_sum$/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const sliceData = (arr) => timeRange.value === "day" ? arr.slice(0, 12) : arr.slice(12, 24);
const visibleHours = computed(() => sliceData(raw.value.hours || []));

/* Data Fetching */
const fetchUssdReport = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await api.get("/cron_local_report/ussd/report", { type: "daily", date: props.date });
    raw.value = { hours: res.hours || [], series: res.series || {} };
  } catch (err) {
    error.value = err?.response?.data?.message || "USSD Data Link Interrupted";
  } finally {
    loading.value = false;
  }
};

/* Series Computeds */
const countSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(k => k.endsWith("_count") && !k.includes("compare") && k !== "ussd_count")
    .map(k => ({ name: labelName(k), data: sliceData(raw.value.series[k] || []) }))
);

const amountSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(k => k.endsWith("_sum"))
    .map(k => ({ name: labelName(k), data: sliceData(raw.value.series[k] || []) }))
);

/* ApexChart Options */
const baseOptions = (yTitle, formatter) => ({
  chart: { 
    toolbar: { show: false }, 
    fontFamily: "Inter, sans-serif", 
    foreColor: "#64748b",
  },
  colors,
  plotOptions: { 
    bar: { 
      borderRadius: 10, 
      columnWidth: "55%",
    } 
  },
  dataLabels: { enabled: false },
  legend: { 
    position: "top", 
    horizontalAlign: "left", 
    fontWeight: 800, 
    fontSize: '12px',
    labels: { colors: '#334155' } 
  },
  xaxis: { 
    categories: visibleHours.value,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontWeight: 600 } }
  },
  yaxis: { 
    title: { text: yTitle, style: { color: '#94a3b8', fontWeight: 700 } },
    labels: { formatter, style: { fontWeight: 600 } } 
  },
  grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
  tooltip: { theme: 'light' }
});

const countOptions = computed(() => baseOptions("Tx Count", v => v.toLocaleString()));
const amountOptions = computed(() => baseOptions("Amount (ETB)", v => "ETB " + (v >= 1000 ? (v/1000).toFixed(1)+'K' : v)));

onMounted(fetchUssdReport);
</script>

<style scoped>
.fixed { animation: backdropFade 0.3s ease-out; }
.bg-white { animation: modalSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes backdropFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalSlide {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>