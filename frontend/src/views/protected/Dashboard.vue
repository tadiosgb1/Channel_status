<template>
  <div class="p-6 bg-gray-100 min-h-screen space-y-6">

    <!-- Header + Filters -->
    <div class="flex flex-wrap gap-4 justify-between items-center">
      <h1 class="text-3xl font-semibold">Channel Dashboard</h1>

      <div class="flex flex-wrap gap-2 items-center">
        <!-- Type -->
        <select v-model="type" @change="loadDashboard" class="border rounded-lg px-3 py-2">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="range">Date Range</option>
        </select>

        <!-- Year -->
        <select
          v-if="['weekly','monthly','quarterly','yearly'].includes(type)"
          v-model="year"
          @change="loadDashboard"
          class="border rounded-lg px-3 py-2"
        >
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>

        <!-- Month -->
        <select
          v-if="['weekly','monthly'].includes(type)"
          v-model="month"
          @change="loadDashboard"
          class="border rounded-lg px-3 py-2"
        >
          <option v-for="m in 12" :key="m" :value="m">Month {{ m }}</option>
        </select>

        <!-- Week -->
        <select
          v-if="type === 'weekly'"
          v-model="week"
          @change="loadDashboard"
          class="border rounded-lg px-3 py-2"
        >
          <option v-for="w in 4" :key="w" :value="w">Week {{ w }}</option>
        </select>

        <!-- Date range -->
        <input
          v-if="type === 'range'"
          type="date"
          v-model="start"
          @change="loadDashboard"
          class="border rounded-lg px-3 py-2"
        />
        <input
          v-if="type === 'range'"
          type="date"
          v-model="end"
          @change="loadDashboard"
          class="border rounded-lg px-3 py-2"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 font-semibold">Loading dashboard...</div>

    <!-- Charts -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Mobile -->
      <div class="bg-white p-6 rounded-xl shadow">
        <h2 class="font-semibold mb-4">Mobile App Operations</h2>
        <apexchart height="350" type="bar" :options="mobileOptions" :series="mobileSeries" />
      </div>

      <!-- USSD -->
      <div class="bg-white p-6 rounded-xl shadow">
        <h2 class="font-semibold mb-4">USSD Operations</h2>
        <apexchart height="350" type="bar" :options="ussdOptions" :series="ussdSeries" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ApiService from "@/services/ApiService";
import VueApexCharts from "vue3-apexcharts";

/* =======================
   STATE
======================= */
const api = new ApiService();

const type = ref("daily");
const year = ref(new Date().getFullYear());
const month = ref(new Date().getMonth() + 1);
const week = ref(1);
const start = ref("");
const end = ref("");

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

/* Chart data */
const mobileLabels = ref([]);
const mobileSeries = ref([]);
const ussdLabels = ref([]);
const ussdSeries = ref([]);

const error = ref(null);
const loading = ref(false);

/* =======================
   HELPERS
======================= */
const buildQueryParams = () => {
  const params = { type: type.value }; // always send type

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

/* =======================
   API CALLS
======================= */
const loadMobileChart = async () => {
  const params = buildQueryParams();
  if (!params) return;

  try {
    const res = await api.get("/cron_local_report/app/report", params);
    mobileLabels.value = res.labels || [];
    mobileSeries.value = Object.keys(res.series || {}).map(key => ({
      name: key.replace("m_", "").replace("_count", ""),
      data: res.series[key],
    }));
  } catch (err) {
    console.error(err);
    error.value = "Failed to load Mobile App chart";
  }
};

const loadUssdChart = async () => {
  const params = buildQueryParams();
  if (!params) return;

  try {
    const res = await api.get("/cron_local_report/ussd/report", params);
    ussdLabels.value = res.labels || [];
    ussdSeries.value = Object.keys(res.series || {}).map(key => ({
      name: key.replace("u_", "").replace("_count", ""),
      data: res.series[key],
    }));
  } catch (err) {
    console.error(err);
    error.value = "Failed to load USSD chart";
  }
};

const loadDashboard = async () => {
  loading.value = true;
  error.value = null;
  await Promise.all([loadMobileChart(), loadUssdChart()]);
  loading.value = false;
};

/* =======================
   CHART OPTIONS
======================= */
const baseChartOptions = (labels) => ({
  chart: { toolbar: { show: false } },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth" },
  xaxis: { categories: labels },
  plotOptions: { bar: { borderRadius: 6 } }
});

const mobileOptions = computed(() => baseChartOptions(mobileLabels.value));
const ussdOptions = computed(() => baseChartOptions(ussdLabels.value));

/* =======================
   INIT
======================= */
onMounted(() => loadDashboard());
</script>

<script>
export default {
  components: { apexchart: VueApexCharts }
};
</script>
