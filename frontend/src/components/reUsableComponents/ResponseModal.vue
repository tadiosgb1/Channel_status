<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-sm shadow-lg w-[95%] max-w-md relative">

      <!-- Header: orange for success, orrange for error -->
      <div :class="status ? 'bg-[#f58220]' : 'bg-secondary'" class="p-3 flex justify-center rounded-t-sm">
        <svg
          v-if="status"
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg
          v-else
          class="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div class="flex justify-between m-4">
        <div>
        
          <h1 :class="status ? 'font-bold text-lg' : 'font-bold text-lg text-orrange-600'">
            {{ status ? 'Thank You' : 'Error' }}
          </h1>
        </div>
        <div :class="status ? 'text-orange-600' : 'text-orrange-600'" class="flex justify-center items-center gap-4">
          <p class="font-semibold text-md mb-1">
            <i :class="status ? 'fas fa-download' : 'fas fa-exclamation-triangle'"></i>
          </p>
          <p>
            <i :class="status ? 'fas fa-share' : 'fas fa-times-circle'"></i>
          </p>
        </div>
      </div>

      <!-- Body -->
      <div class="px-4 pt-4 pb-2 text-sm text-gray-800 text-left">
        <p class="whitespace-pre-line text-[13px] leading-relaxed">{{ message }}</p>
      </div>

      <div class="flex justify-between items-center px-4 py-2 text-sm">
        <button
          @click="$emit('close')"
          :class="status ? 'text-[#f58220]' : 'text-orrange-600'"
          class="font-semibold hover:underline"
        >
          {{ status ? 'Finish' : 'Close' }}
        </button>
        <img
          src="@/assets/logo.png"
          alt="Wegagen Logo"
          class="h-16 w-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  status: Boolean,  
  title: String,
  message: String,
});
</script>
