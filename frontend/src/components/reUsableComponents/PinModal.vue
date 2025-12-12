<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg w-[95%] max-w-md p-6 relative">
      <!-- Header -->
      <h2 class="text-center text-lg font-semibold mb-4 bg-primary p-3 rounded-t-lg text-white">
        Enter your PIN
      </h2>

      <!-- Amount Display -->
      <div class="text-center text-xl font-bold mb-6">
        {{ amount }} ETB
      </div>

      <!-- 4 PIN Boxes -->
      <div class="flex justify-center gap-4 mb-6">
        <input
          v-for="(digit, index) in pinDigits"
          :key="index"
          type="text"
          maxlength="1"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-12 h-12 text-xl text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary custom-input"
          v-model="pinDigits[index]"
          @input="onDigitInput(index)"
          ref="pinRefs"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-between gap-4">
        <button
          class="flex-1 bg-secondary text-white py-2 rounded hover:bg-gray-300 transition"
          @click="$emit('close')"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          class="flex-1 bg-primary text-white py-2 rounded hover:bg-orange-600 transition disabled:opacity-50 flex justify-center items-center"
          @click="handleConfirm"
          :disabled="isSubmitting || pinDigits.join('').length !== 4"
        >
          <span v-if="isSubmitting" class="mr-2">Verifying...</span>
          <span v-else>Confirm</span>
          <span
            v-if="isSubmitting"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"
          ></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  visible: Boolean,
  amount: String,
});
const emit = defineEmits(['close', 'confirm']);

const pinDigits = ref(['', '', '', '']);
const pinRefs = ref([]);

const isSubmitting = ref(false);

const onDigitInput = (index) => {
  const val = pinDigits.value[index];
  // Only allow digit and move focus
  if (/^\d$/.test(val) && index < 3) {
    nextTick(() => pinRefs.value[index + 1]?.focus());
  } else if (!/^\d$/.test(val)) {
    pinDigits.value[index] = ''; // remove invalid input
  }
};

const handleConfirm = async () => {
  if (pinDigits.value.join('').length !== 4) return;

  isSubmitting.value = true;
  try {
    const fullPin = pinDigits.value.join('');
    emit('confirm', fullPin);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
