<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">

      <!-- Header -->
      <h2 class="text-lg font-semibold text-center text-white bg-orange-500 p-3 rounded-t-lg">
        {{ title }}
      </h2>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
        :disabled="loading"
      >
        &times;
      </button>

      <!-- Content -->
      <div class="mt-4 space-y-2 text-gray-700 text-sm">
        <div v-for="(value, key) in data" :key="key" >

          <span class="font-semibold capitalize">{{ key }}:</span>
        
          {{ maskValue(key, value) }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          :disabled="loading"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
          :disabled="loading"
        >
          <span v-if="loading" class="mr-2">Processing...</span>
          <span v-else>Confirm</span>
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"
          ></span>
        </button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, required: true },
  title: { type: String, required: true },
  data: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
});

const maskValue = (key, value) => {
  if (key.toLowerCase().includes('account') && value?.length > 5) {
    return '********' + value.slice(-5);
  }
  return value;
};
</script>