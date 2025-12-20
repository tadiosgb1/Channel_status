<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-6xl rounded-xl shadow-lg p-6">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-primary">
          USSD – Daily Hourly Report
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-16 text-gray-500 font-medium">
        Loading USSD data...
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
            <button
              @click="tab = 'count'"
              :class="tabClass('count')"
            >
              Transaction Count
            </button>
            <button
              @click="tab = 'amount'"
              :class="tabClass('amount')"
            >
              Transaction Amount (ETB)
            </button>
          </nav>
        </div>

        <!-- COUNT CHART -->
        <apexchart
          v-if="tab === 'count'"
          type="bar"
          height="460"
          :options="countOptions"
          :series="countSeries"
        />

        <!-- AMOUNT CHART -->
        <apexchart
          v-if="tab === 'amount'"
          type="bar"
          height="460"
          :options="amountOptions"
          :series="amountSeries"
        />
      </div>

      <!-- Footer -->
      <div class="mt-6 text-right">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ApiService from "@/services/ApiService";

/* Optional specific date */
const props = defineProps({
  date: {
    type: String,
    default: null,
  },
});

const loading = ref(false);
const error = ref(null);
const tab = ref("count");

/* Raw API response */
const raw = ref({
  labels: [],
  series: {},
});

const api = new ApiService();

/* Fetch USSD daily report */
const fetchUssdReport = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = { type: "daily" };
    if (props.date) params.date = props.date;

    const res = await api.get("/cron_local_report/ussd/report", params);

    raw.value.labels = res.labels || [];
    raw.value.series = res.series || {};
  } catch (err) {
    error.value =
      err?.response?.data?.message || "Failed to load USSD daily report";
    console.error("USSD Report Error:", err);
  } finally {
    loading.value = false;
  }
};

/* Convert API keys to readable names */
const labelName = (key) => {
  if (key === "ussd_count") return "Total USSD Users";

  return key
    .replace(/^u_/, "")
    .replace(/_count|_sum$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

/* ===== Series ===== */

const countSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(
      k =>
        k.endsWith("_count") &&
        !k.includes("compare") &&
        k !== "ussd_count"   // 👈 exclude total
    )
    .map(k => ({
      name: labelName(k),
      data: raw.value.series[k],
    }))
);


const amountSeries = computed(() =>
  Object.keys(raw.value.series)
    .filter(k => k.endsWith("_sum"))
    .map(k => ({
      name: labelName(k),
      data: raw.value.series[k],
    }))
);

/* ===== Chart Options ===== */

const colors = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
];

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
    categories: raw.value.labels,
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
    borderColor: "#e5e7eb",
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

/* Tab styles */
const tabClass = (t) => [
  "py-3 px-1 border-b-2 font-medium text-base",
  tab.value === t
    ? "border-primary text-primary"
    : "border-transparent text-gray-600 hover:text-primary hover:border-primary",
];

onMounted(fetchUssdReport);
</script>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
