<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-6xl rounded-xl shadow-lg p-6">

      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-primary">
          Mobile App – Daily Report 
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-red-500 text-xl">
          ✕
        </button>
      </div>

      

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20 text-gray-500 font-medium">
        Loading mobile app data...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-600 text-center py-12 font-medium">
        {{ error }}
      </div>

      <!-- Charts -->
      <div v-else>
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex space-x-8">
            <button @click="tab = 'counts'" :class="tabClass('counts')">
              Transaction Counts
            </button>
            <button @click="tab = 'amounts'" :class="tabClass('amounts')">
              Transaction Amounts (ETB)
            </button>
          </nav>
        </div>

        <!-- Counts Chart -->
        <apexchart
          v-if="tab === 'counts'"
          type="bar"
          height="460"
          :options="countOptions"
          :series="countSeries"
        />

        <!-- Amounts Chart -->
        <apexchart
          v-if="tab === 'amounts'"
          type="bar"
          height="460"
          :options="amountOptions"
          :series="amountSeries"
        />
      </div>

      <!-- Footer -->
      <div class="mt-6 text-right gap-4 flex justify-end items-center space-x-4">
        <!-- Day / Night Toggle -->
      
        <button
          @click="timeRange = 'day'"
          :class="timeRange === 'day'
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 text-gray-600'"
          class="px-4 py-2 rounded-lg font-medium"
        >
          Day time
        </button>

        <button
          @click="timeRange = 'night'"
          :class="timeRange === 'night'
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600'"
          class="px-4 py-2 rounded-lg font-medium"
        >
          Night 
        </button>
    
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ApiService from "@/services/ApiService";

/* Props */
const props = defineProps({
  date: {
    type: String,
    default: null,
  },
});

/* State */
const loading = ref(false);
const error = ref(null);
const tab = ref("counts");
const timeRange = ref("day"); // day | night

/* RAW API DATA */
const raw = ref({
  hours: [],
  series: {},
});

const api = new ApiService();

/* Colors */
const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

/* Clean backend keys */
const cleanName = (key) =>
  key
    .replace(/^m_/, "")
    .replace(/_count|_sum$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

/* API CALL */
const getDailyAppReport = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = { type: "daily" };
    if (props.date) params.date = props.date;

    const res = await api.get("/cron_local_report/app/report", params);

    raw.value = {
      hours: res.hours || [],
      series: res.series || {},
    };
  } catch (err) {
    error.value =
      err?.response?.data?.message || "Failed to load daily app report";
    console.error("App Modal Error:", err);
  } finally {
    loading.value = false;
  }
};

/* ===== DAY / NIGHT SLICING ===== */

const visibleHours = computed(() =>
  timeRange.value === "day"
    ? raw.value.hours.slice(0, 12)     // 06 AM → 05 PM
    : raw.value.hours.slice(12, 24)    // 06 PM → 05 AM
);

const sliceData = (arr) =>
  timeRange.value === "day"
    ? arr.slice(0, 12)
    : arr.slice(12, 24);

/* ===== SERIES ===== */

const countSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(k => k.endsWith("_count") && k !== "app_count")
    .map(k => ({
      name: cleanName(k),
      data: sliceData(raw.value.series[k]),
    }))
);

const amountSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(k => k.endsWith("_sum"))
    .map(k => ({
      name: cleanName(k),
      data: sliceData(raw.value.series[k]),
    }))
);

/* ===== CHART OPTIONS ===== */

const baseOptions = (yTitle, formatter) => ({
  chart: {
    toolbar: { show: true },
    fontFamily: "Inter, sans-serif",
  },
  colors,
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "55%",
    },
  },
  dataLabels: { enabled: false },
  legend: {
    position: "top",
    horizontalAlign: "left",
  },
  xaxis: {
    categories: visibleHours.value,
    title: { text: "Hour" },
  },
  yaxis: {
    title: { text: yTitle },
    labels: { formatter },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
  },
});

const countOptions = computed(() =>
  baseOptions("Transaction Count", v => v.toLocaleString())
);

const amountOptions = computed(() =>
  baseOptions(
    "Amount (ETB)",
    v => "ETB " + v.toLocaleString(undefined, { maximumFractionDigits: 0 })
  )
);

/* Tabs Style */
const tabClass = (t) => [
  "py-3 px-1 border-b-2 font-medium text-base",
  tab.value === t
    ? "border-primary text-primary"
    : "border-transparent text-gray-600 hover:text-primary hover:border-primary",
];

onMounted(getDailyAppReport);
</script>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
