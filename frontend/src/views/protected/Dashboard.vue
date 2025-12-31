<template>
  <div class="bg-gray-50 min-h-screen space-y-8">

    <!-- Header + Filters -->
    <div class="bg-white rounded-xl shadow-sm p-6 m-4">
      <div class="flex flex-wrap gap-4 justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-800">Channel Operations Dashboard</h1>

        <div class="flex justify-between">
          <select name="channel" id="channel" v-model="activeChannel"
            class="border border-secondary rounded-lg px-4 py-2.5 mr-6 focus:ring-2 focus:ring-primary">
            <option value="mobile">Mobile App</option>
            <option value="ussd">USSD</option>
          </select>

          <div class="flex flex-wrap gap-3 items-center">
            <select v-model="type" @change="loadDashboard"
              class="border border-secondary rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="range">Date Range</option>
            </select>

            <select v-if="['weekly','monthly','quarterly','yearly'].includes(type)" v-model="year" @change="loadDashboard"
              class="border border-gray-300 rounded-lg px-4 py-2.5">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>

            <select v-if="['weekly','monthly'].includes(type)" v-model="month" @change="loadDashboard"
              class="border border-gray-300 rounded-lg px-4 py-2.5">
              <option v-for="m in 12" :key="m" :value="m">{{ monthNames[m - 1] }}</option>
            </select>

            <select v-if="type === 'weekly'" v-model="week" @change="loadDashboard"
              class="border border-gray-300 rounded-lg px-4 py-2.5">
              <option v-for="w in 5" :key="w" :value="w">Week {{ w }}</option>
            </select>

            <div v-if="type === 'range'" class="flex gap-3">
              <input type="date" v-model="start" @change="loadDashboard"
                class="border border-gray-300 rounded-lg px-4 py-2.5" />
              <input type="date" v-model="end" @change="loadDashboard"
                class="border border-gray-300 rounded-lg px-4 py-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error / Loading -->
    <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg font-medium">{{ error }}</div>
    <div v-if="loading" class="text-center text-gray-600 font-medium py-12">Loading dashboard data...</div>

    <!-- Main Tabs: Mobile vs USSD -->
    <div v-else class="w-full">
      <!-- Channel Content -->
      <div class="mt-8">
        <!-- Mobile App Tab -->
        <div v-show="activeChannel === 'mobile'">
          <div class="border-b border-gray-200 mb-8">
            <nav class="flex space-x-6">
              <button @click="mobileTab = 'counts'" :class="tabClass(mobileTab, 'counts')">
                Transaction Counts
              </button>
              <button @click="mobileTab = 'amounts'" :class="tabClass(mobileTab, 'amounts')">
                Transaction Amounts (ETB)
              </button>
            </nav>
          </div>

          <!-- Mobile Counts Chart -->
          <div v-if="mobileTab === 'counts'" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-800">Mobile App - Transaction Counts</h2>
              <p class="text-sm text-gray-500 mt-2">Number of operations per hour/day across all services</p>
            </div>
            <apexchart type="bar" height="550" :options="mobileCountOptions" :series="mobileCountSeries" />
          </div>

          <!-- Mobile Amounts Chart -->
          <div v-if="mobileTab === 'amounts'" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-800">Mobile App - Transaction Amounts (ETB)</h2>
              <p class="text-sm text-gray-500 mt-2">Total monetary value transacted per hour/day</p>
            </div>
            <apexchart type="bar" height="550" :options="mobileAmountOptions" :series="mobileAmountSeries" />
          </div>
        </div>

        <!-- USSD Tab -->
        <div v-show="activeChannel === 'ussd'">
          <div class="border-b border-gray-200 mb-8">
            <nav class="flex space-x-6">
              <button @click="ussdTab = 'counts'" :class="tabClass(ussdTab, 'counts')">
                Transaction Counts
              </button>
              <button @click="ussdTab = 'amounts'" :class="tabClass(ussdTab, 'amounts')">
                Transaction Amounts (ETB)
              </button>
            </nav>
          </div>

          <!-- USSD Counts Chart -->
          <div v-if="ussdTab === 'counts'" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-800">USSD - Transaction Counts</h2>
              <p class="text-sm text-gray-500 mt-2">Number of operations per hour/day across all services</p>
            </div>
            <apexchart type="bar" height="550" :options="ussdCountOptions" :series="ussdCountSeries" />
          </div>

          <!-- USSD Amounts Chart -->
          <div v-if="ussdTab === 'amounts'" class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-semibold text-gray-800">USSD - Transaction Amounts (ETB)</h2>
              <p class="text-sm text-gray-500 mt-2">Total monetary value transacted per hour/day</p>
            </div>
            <apexchart type="bar" height="550" :options="ussdAmountOptions" :series="ussdAmountSeries" />
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

const type = ref("daily");
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);
const week = ref(1);
const start = ref("");
const end = ref("");

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Tab states
const activeChannel = ref("mobile");
const mobileTab = ref("counts");
const ussdTab = ref("counts");

const error = ref(null);
const loading = ref(false);

const mobileRaw = ref({ labels: [], hours: [], series: {} });
const ussdRaw = ref({ labels: [], hours: [], series: {} });

// Colors
const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

// Build query parameters
const buildQueryParams = () => {
  const params = { type: type.value };
  if (["weekly","monthly","quarterly","yearly"].includes(type.value)) params.year = year.value;
  if (["weekly","monthly"].includes(type.value)) params.month = month.value;
  if (type.value === "weekly") params.week = week.value;
  if (type.value === "range") {
    if (!start.value || !end.value) {
      error.value = "Please select both start and end dates";
      return null;
    }
    params.start = start.value;
    params.end = end.value;
  }
  return params;
};

// Load charts
const loadMobileChart = async () => {
  const params = buildQueryParams();
  if (!params) return;
  try {
    const res = await api.get("/cron_local_report/app/report", params);
    mobileRaw.value = { labels: res.labels || [], hours: res.hours || [], series: res.series || {} };
  } catch {
    error.value = "Failed to load Mobile App data";
  }
};

const loadUssdChart = async () => {
  const params = buildQueryParams();
  if (!params) return;
  try {
    const res = await api.get("/cron_local_report/ussd/report", params);
    ussdRaw.value = { labels: res.labels || [], hours: res.hours || [], series: res.series || {} };
  } catch {
    error.value = "Failed to load USSD data";
  }
};

const loadDashboard = async () => {
  loading.value = true;
  error.value = null;
  await Promise.all([loadMobileChart(), loadUssdChart()]);
  loading.value = false;
};

// Clean series name
const cleanName = (key) => {
  return key
    .replace(/^m_|^u_/, '')
    .replace(/_count|_sum$/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

// Chart options generator
const chartOptions = (labelsArray, yTitle, formatter) => ({
  chart: { toolbar: { show: true }, fontFamily: 'Inter, sans-serif' },
  colors,
  plotOptions: { bar: { borderRadius: 8, columnWidth: '55%', endingShape: 'rounded' } },
  dataLabels: { enabled: false },
  legend: { position: 'top', horizontalAlign: 'left', fontSize: '14px' },
  xaxis: { categories: labelsArray, labels: { style: { fontSize: '12px' } } },
  yaxis: { title: { text: yTitle }, labels: { formatter } },
  tooltip: { shared: true, intersect: false, y: { formatter } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
});

// Mobile series
const mobileCountSeries = computed(() =>
  Object.keys(mobileRaw.value.series || {})
    .filter(k => k.includes('_count') && !k.includes('app_count'))
    .map(k => ({ name: cleanName(k), data: mobileRaw.value.series[k] || [] }))
);
const mobileAmountSeries = computed(() =>
  Object.keys(mobileRaw.value.series || {})
    .filter(k => k.includes('_sum'))
    .map(k => ({ name: cleanName(k), data: mobileRaw.value.series[k] || [] }))
);

// USSD series
const ussdCountSeries = computed(() =>
  Object.keys(ussdRaw.value.series || {})
    .filter(k => k.includes('_count') && k !== 'ussd_count')
    .map(k => ({ name: cleanName(k), data: ussdRaw.value.series[k] || [] }))
);
const ussdAmountSeries = computed(() =>
  Object.keys(ussdRaw.value.series || {})
    .filter(k => k.includes('_sum'))
    .map(k => ({ name: cleanName(k), data: ussdRaw.value.series[k] || [] }))
);

// Daily/hourly chart options use hours from API
const mobileCountOptions = computed(() =>
  type.value === 'daily' ? chartOptions(mobileRaw.value.hours, 'Transaction Count', v => v.toLocaleString()) 
                          : chartOptions(mobileRaw.value.labels, 'Transaction Count', v => v.toLocaleString())
);
const mobileAmountOptions = computed(() =>
  type.value === 'daily' ? chartOptions(mobileRaw.value.hours, 'Amount (ETB)', v => 'ETB ' + v.toLocaleString()) 
                          : chartOptions(mobileRaw.value.labels, 'Amount (ETB)', v => 'ETB ' + v.toLocaleString())
);
const ussdCountOptions = computed(() =>
  type.value === 'daily' ? chartOptions(ussdRaw.value.hours, 'Transaction Count', v => v.toLocaleString()) 
                          : chartOptions(ussdRaw.value.labels, 'Transaction Count', v => v.toLocaleString())
);
const ussdAmountOptions = computed(() =>
  type.value === 'daily' ? chartOptions(ussdRaw.value.hours, 'Amount (ETB)', v => 'ETB ' + v.toLocaleString()) 
                          : chartOptions(ussdRaw.value.labels, 'Amount (ETB)', v => 'ETB ' + v.toLocaleString())
);

// Tab style
const tabClass = (currentTab, t) => [
  'py-3 px-1 border-b-2 font-medium text-base',
  currentTab === t
    ? 'border-primary text-primary'
    : 'border-transparent text-gray-600 hover:text-primary hover:border-primary'
];

onMounted(loadDashboard);
</script>

<script>
export default {
  components: {
    apexchart: VueApexCharts
  }
};
</script>
