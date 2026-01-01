<template>
  <div class="bg-slate-50 min-h-screen p-4 md:p-8 font-sans text-slate-900">
    <div class="max-w-[1600px] mx-auto space-y-8">
      
      <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div>
            <h1 class="text-3xl font-black text-slate-800 uppercase tracking-tight italic">
              Channels <span class="text-primary font-light">Status</span> Dashboard
            </h1>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Live Transaction Monitoring Hub</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button @click="activeChannel = 'mobile'; loadDashboard()" 
                :class="activeChannel === 'mobile' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'"
                class="px-5 py-2 rounded-lg text-xs font-black uppercase transition-all">Mobile App</button>
              <button @click="activeChannel = 'ussd'; loadDashboard()" 
                :class="activeChannel === 'ussd' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'"
                class="px-5 py-2 rounded-lg text-xs font-black uppercase transition-all">USSD</button>
            </div>

            <div class="relative group">
              <select v-model="type" @change="loadDashboard"
                class="appearance-none bg-white border border-slate-200 rounded-xl px-5 py-2.5 pr-10 text-xs font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>

            <select v-if="['weekly','monthly','quarterly','yearly'].includes(type)" v-model="year" @change="loadDashboard"
              class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm outline-none">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>

            <select v-if="['weekly','monthly'].includes(type)" v-model="month" @change="loadDashboard"
              class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm outline-none">
              <option v-for="m in 12" :key="m" :value="m">{{ monthNames[m - 1] }}</option>
            </select>

            <select v-if="type === 'weekly'" v-model="week" @change="loadDashboard"
              class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm outline-none">
              <option v-for="w in 5" :key="w" :value="w">Week {{ w }}</option>
            </select>

            <div v-if="type === 'range'" class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <input type="date" v-model="start" @change="loadDashboard" class="bg-transparent border-none text-[11px] font-bold p-1 px-2 outline-none" />
              <span class="text-slate-300">|</span>
              <input type="date" v-model="end" @change="loadDashboard" class="bg-transparent border-none text-[11px] font-bold p-1 px-2 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <span class="font-black">ERROR:</span> {{ error }}
        </div>

        <div v-if="loading" class="bg-white rounded-[2rem] h-[600px] flex flex-col items-center justify-center border border-slate-200">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-slate-400 font-black tracking-widest uppercase animate-pulse">Syncing Channel Data...</p>
        </div>

        <div v-else class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div class="px-10 pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-50">
            <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button @click="tab = 'counts'" :class="tab === 'counts' ? 'bg-white text-primary shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
                class="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300">
                Tx Counts
              </button>
              <button @click="tab = 'amounts'" :class="tab === 'amounts' ? 'bg-white text-primary shadow-md scale-[1.02]' : 'text-slate-500 hover:text-slate-700'"
                class="px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300">
                Amounts
              </button>
            </div>

            <div v-if="type === 'daily'" class="flex items-center gap-1 bg-slate-800 p-1.5 rounded-full shadow-lg">
              <button @click="timeRange = 'day'" :class="timeRange === 'day' ? 'bg-yellow-400 text-slate-900 shadow-sm' : 'text-white/40 hover:text-white'"
                class="p-2.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
              </button>
              <button @click="timeRange = 'night'" :class="timeRange === 'night' ? 'bg-indigo-500 text-white shadow-sm' : 'text-white/40 hover:text-white'"
                class="p-2.5 rounded-full transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              </button>
            </div>
          </div>

          <div class="p-10">
            <div class="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
              <apexchart
                type="bar"
                height="520"
                :options="chartOptions"
                :series="chartSeries"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import VueApexCharts from "vue3-apexcharts";

const api = new ApiService();

/* ================= STATE ================= */
const activeChannel = ref("mobile");
const type = ref("daily");
const tab = ref("counts");
const timeRange = ref("day");

const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);
const week = ref(1);
const start = ref("");
const end = ref("");

const loading = ref(false);
const error = ref(null);

/* ================= CONST ================= */
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

/* ================= RAW DATA ================= */
const raw = ref({
  labels: [],
  hours: [],
  series: {},
});

/* ================= HELPERS ================= */
const cleanName = (k) =>
  k.replace(/^m_|^u_/, "")
   .replace(/_count|_sum$/, "")
   .replace(/_/g, " ")
   .replace(/\b\w/g, l => l.toUpperCase());

const buildParams = () => {
  const p = { type: type.value };
  if (["weekly","monthly","quarterly","yearly"].includes(type.value)) p.year = year.value;
  if (["weekly","monthly"].includes(type.value)) p.month = month.value;
  if (type.value === "weekly") p.week = week.value;
  if (type.value === "range") {
    if (!start.value || !end.value) return null;
    p.start = start.value;
    p.end = end.value;
  }
  return p;
};

/* ================= DAY / NIGHT ================= */
const visibleHours = computed(() =>
  timeRange.value === "day"
    ? raw.value.hours.slice(0, 12)
    : raw.value.hours.slice(12, 24)
);

const sliceData = (arr) =>
  timeRange.value === "day"
    ? arr.slice(0, 12)
    : arr.slice(12, 24);

/* ================= SERIES ================= */
const chartSeries = computed(() =>
  Object.keys(raw.value.series || {})
    .filter(k => {
      if (tab.value === "counts") {
        if (activeChannel.value === "mobile" && k === "app_count") return false;
        if (activeChannel.value === "ussd" && k === "ussd_count") return false;
        return k.endsWith("_count");
      }
      return k.endsWith("_sum");
    })
    .map(k => ({
      name: cleanName(k),
      data:
        type.value === "daily"
          ? sliceData(raw.value.series[k] || [])
          : raw.value.series[k] || [],
    }))
);

/* ================= UPDATED OPTIONS FOR NEW DESIGN ================= */
const chartOptions = computed(() => ({
  chart: { 
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    foreColor: "#64748b" 
  },
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'],
  plotOptions: { 
    bar: { 
      borderRadius: 10, 
      columnWidth: "55%",
      dataLabels: { position: 'top' } 
    } 
  },
  dataLabels: { enabled: false },
  legend: { 
    position: "top", 
    horizontalAlign: "left", 
    fontWeight: 800, 
    fontSize: '12px',
    markers: { radius: 12 },
    labels: { colors: '#334155' } 
  },
  xaxis: {
    categories:
      type.value === "daily"
        ? visibleHours.value
        : raw.value.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { fontWeight: 600 } }
  },
  yaxis: {
    title: {
      text: tab.value === "counts" ? "Transaction Count" : "Amount (ETB)",
      style: { color: '#94a3b8', fontWeight: 700 }
    },
    labels: {
      formatter: v =>
        tab.value === "counts"
          ? v.toLocaleString()
          : "ETB " + (v >= 1000 ? (v/1000).toFixed(1) + 'K' : v),
      style: { fontWeight: 600 }
    },
  },
  grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
  tooltip: { theme: 'light' }
}));

/* ================= API ================= */
const loadDashboard = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = buildParams();
    if (!params) {
      error.value = "Please select valid date range";
      return;
    }

    const url =
      activeChannel.value === "mobile"
        ? "/cron_local_report/app/report"
        : "/cron_local_report/ussd/report";

    const res = await api.get(url, params);

    raw.value = {
      labels: res.labels || [],
      hours: res.hours || [],
      series: res.series || {},
    };
  } catch {
    error.value = "Failed to load dashboard data";
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>

<script>
export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>