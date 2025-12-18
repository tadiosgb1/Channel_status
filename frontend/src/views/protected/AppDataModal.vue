<!-- src/components/AppDataModal.vue -->
<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    @click.self="close"
  >
    <!-- Modal Card -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">
              {{ channel === 'mobile' ? 'Mobile App' : 'USSD' }} Transactions
            </h2>
            <p class="text-blue-100 mt-1">
              {{ title }} • {{ formatDateRange }}
            </p>
          </div>
          <button
            @click="close"
            class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body: Scrollable Table -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Type
                </th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (ETB)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in tableData"
                :key="item.name"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                  {{ item.count.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                  {{ item.amount ? 'ETB ' + item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—' }}
                </td>
              </tr>
            </tbody>
            <!-- Total Row -->
            <tfoot class="bg-gray-100 font-semibold">
              <tr>
                <td class="px-6 py-5 text-left">Total</td>
                <td class="px-6 py-5 text-right">{{ totalCount.toLocaleString() }}</td>
                <td class="px-6 py-5 text-right text-blue-600">
                  ETB {{ totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div v-if="tableData.length === 0" class="text-center py-12 text-gray-500">
          No transaction data available for this period.
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          Data refreshed on: {{ new Date().toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  channel: {
    type: String,
    required: true,
    validator: (v) => ['mobile', 'ussd'].includes(v)
  },
  type: String, // daily, weekly, etc.
  year: Number,
  month: Number,
  week: Number,
  start: String,
  end: String,
  rawData: {
    type: Object,
    default: () => ({ series: {}, labels: [] })
  }
});

const emit = defineEmits(['update:isOpen']);

const close = () => {
  emit('update:isOpen', false);
};

// Clean name helper (same as in dashboard)
const cleanName = (key) => {
  return key
    .replace(/^m_|^u_/, '')
    .replace(/_count|_sum$/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

// Build table data: match _count and _sum pairs
const tableData = computed(() => {
  const series = props.rawData.series || {};
  const entries = [];

  const countKeys = Object.keys(series).filter(k =>
    k.includes('_count') && !(props.channel === 'mobile' && k.includes('app_count'))
  );

  countKeys.forEach(countKey => {
    const baseName = countKey.replace('_count', '');
    const sumKey = baseName + '_sum';
    const name = cleanName(countKey);

    let totalCount = 0;
    let totalAmount = 0;

    // Sum across all labels (in case of multiple data points)
    (series[countKey] || []).forEach(val => totalCount += val);
    if (series[sumKey]) {
      (series[sumKey] || []).forEach(val => totalAmount += val);
    }

    entries.push({
      name,
      count: totalCount,
      amount: totalAmount || null
    });
  });

  return entries.sort((a, b) => b.count - a.count); // Sort by count descending
});

const totalCount = computed(() => tableData.value.reduce((sum, item) => sum + item.count, 0));
const totalAmount = computed(() => tableData.value.reduce((sum, item) => sum + (item.amount || 0), 0));

const title = computed(() => {
  if (props.type === 'daily') return 'Daily Summary';
  if (props.type === 'weekly') return `Week ${props.week}, ${props.year}`;
  if (props.type === 'monthly') return `${monthNames.value[props.month - 1]} ${props.year}`;
  if (props.type === 'quarterly') return `Q${Math.ceil(props.month / 3)} ${props.year}`;
  if (props.type === 'yearly') return `${props.year}`;
  if (props.type === 'range') return `${props.start} to ${props.end}`;
  return 'Summary';
});

const monthNames = ref([
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]);

const formatDateRange = computed(() => {
  return title.value;
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>