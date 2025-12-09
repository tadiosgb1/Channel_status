<template>
  <div class="min-h-screen flex justify-center bg-[#006523]/5">
    <div
      class="flex flex-col items-center bg-white w-full max-w-md shadow-lg lg:rounded-xl my-0 lg:my-10"
    >
      <Header />

      <!-- Toast Notification -->
      <Toast ref="toast" />

      <div
        class="w-full max-w-md px-6 py-12 flex flex-col items-center space-y-6"
      >
        <h2 class="text-xs font-semibold text-gray-500">
          Enter the OTP sent to your phone number!
        </h2>

        <!-- OTP Input Boxes -->
        <div class="flex space-x-4">
          <input
            v-for="(digit, index) in otp"
            :key="index"
            v-model="otp[index]"
            type="text"
            maxlength="1"
            class="w-10 h-10 text-center border-2 border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            @input="moveToNext(index, $event)"
            @keydown.backspace.prevent="handleBackspace(index, $event)"
            @paste.prevent="handlePaste($event)"
          />
        </div>

        <!-- Resend OTP Link -->
        <div class="w-full flex justify-end">
          <button
            class="text-sm text-blue-500 hover:text-orange-500 transition focus:outline-none mr-20"
            @click="resendOtp"
          >
            Resend OTP
          </button>
        </div>

        <!-- Submit Button -->
        <button
          class="bg-orange-500 w-64 h-10 text-white font-semibold px-6 py-2 rounded hover:bg-orange-600 transition"
          @click="checkOtp"
        >
          Submit OTP
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Header from "./layouts/header.vue";
import Toast from "../../components/reUsableComponents/Toast.vue";


export default {
  components: { Header, Toast },
  setup() {
    const otp = ref(["", "", "", ""]);
    const router = useRouter();

    const { proxy } = getCurrentInstance();

    const moveToNext = (index, event) => {
      const value = event.target.value;
      if (value && index < otp.value.length - 1) {
        const nextInput = event.target.nextElementSibling;
        if (nextInput) nextInput.focus();
      }
    };

    const handleBackspace = (index, event) => {
      if (otp.value[index]) {
        otp.value[index] = "";
      } else if (index > 0) {
        otp.value[index - 1] = "";
        const previousInput = event.target.previousElementSibling;
        if (previousInput) previousInput.focus();
      }
    };

    const handlePaste = (event) => {
      const pastedData = event.clipboardData.getData("text").trim();
      if (/^\d{4}$/.test(pastedData)) {
        for (let i = 0; i < 4; i++) {
          otp.value[i] = pastedData[i];
        }
      }
    };

    const checkOtp = async () => {
      alert("Checking OTP...");
      const enteredCode = otp.value.join("");

      if (enteredCode.length < 4) {
        proxy.$refs.toast.showErrorToastMessage("Please enter all 4 digits");
        return;
      }

      const phone = localStorage.getItem("userPhone");
      console.log("Phone number:", phone);

      if (!phone) {
        proxy.$refs.toast.showErrorToastMessage(
          "Phone number not found. Please restart."
        );
        return;
      }

      if(enteredCode=='1234'){
        localStorage.setItem('otp_verified',true);
         router.push("/login");
      }

     
      // try {
      //   const res = await axios.post(
      //     "/api/mobileInterface/rest/cardOTP",
      //     {
      //       operation: "verify", // or "verify"
      //       type: "phone", // or "account"
      //       message: "Your generic OTP is @OTP",
      //       phone: phone, // replace with account number if type is "account"
      //       otp: enteredCode, // optional, used for verification
      //     }
      //   );

      //   console.log(res.data);

      //   if (res.data.status > 0) {
      //     useLocaleStore().setOtpVerified(true);
      //     router.push("/login");
      //   } else {
      //     proxy.$refs.toast.showErrorToastMessage(
      //       "This phone is not registered or OTP not generated."
      //     );
      //   }
      // } catch (err) {
      //   proxy.$refs.toast.showErrorToastMessage("Network or server error.");
      //   console.error(err);
      // }
      
    };

    const resendOtp = () => {
      // Simulate resend action or call real API
      proxy.$refs.toast.showInfoToastMessage("OTP resent to your phone.");
    };

    onMounted(() => {
      const otp_sent= localStorage.getItem("otp_sent");
      if (!otp_sent) {
        proxy.$refs.toast.showErrorToastMessage("Please request OTP first.");
        console.log("otp should be sent")
        router.push("/");
      }
    });

    return {
      otp,
      moveToNext,
      handleBackspace,
      handlePaste,
      checkOtp,
      resendOtp,
    };
  },
};
</script>
