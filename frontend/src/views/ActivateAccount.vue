<template>
  <div class="min-h-screen flex  justify-center bg-[#006523]/5 pt-2 pb-8">
    <div class="flex flex-col items-center justify-start bg-white w-full max-w-md h-auto shadow-lg">
    <!-- Header -->
    <div class="w-full bg-orange-500 text-white flex flex-col items-center py-6">
      <div class="text-xs self-start ml-4">



        
      </div>
      <img src="@/assets/wegagen-logo.jpg" alt="Wegagen Bank" class="h-10 mt-2" />
    </div>

    <!-- Body -->
    <div class="w-full max-w-md px-6 py-12 flex flex-col items-center space-y-6">
      <h2 class="text-lg font-semibold text-orange-500">Let's Activate Your Account</h2>
      
      <!-- OTP Input Boxes -->
      <div class="flex space-x-4">
        <input v-for="(digit, index) in otp" :key="index" v-model="otp[index]"
          type="text" maxlength="1"
          class="w-12 h-12 text-center border-2 border-orange-400 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          @input="moveToNext(index, $event)"
        />
      </div>

      <!-- Verify Button -->
      <button
        class="bg-orange-500 text-white font-semibold px-6 py-2 rounded hover:bg-orange-600 transition"
        @click="verifyCode"
      >
        Verify
      </button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const otp = ref(["", "", "", ""]);

const moveToNext = (index, event) => {
  if (event.inputType === 'deleteContentBackward') return;
  const next = event.target.nextElementSibling;
  if (next) next.focus();
};

const verifyCode = () => {
  const code = otp.value.join('');
  if (code.length === 4) {
    alert(`Verifying code: ${code}`);
    router.push('/dashboard/home');
  } else {
    alert('Please enter all 4 digits');
  }
};
</script>
