<template>
  <div
    class="min-h-screen flex justify-center bg-[#006523]/5"
    v-if="showWelcome"
  >
    <Toast ref="toast" />

    <div
      class="flex flex-col items-center bg-white w-full max-w-md shadow-lg lg:rounded-xl my-0 lg:my-10"
    >
      <Header />

      <div class="px-8 w-full">
        <div class="text-center mt-12">
          <h1 class="text-3xl font-semibold text-primary">
            {{ $t("wellcome") }}
          </h1>
        </div>

        <!-- Phone Input -->
        <div class="mt-8 w-full">
          <div
            class="flex items-center border border-orange-500 rounded-md overflow-hidden"
          >
            <span class="bg-gray-100 px-3 py-2 text-primary font-semibold"
              >+251</span
            >
            <input
              type="text"
              v-model="mobileNumber"
              placeholder="Enter Mobile Number"
              class="w-full px-4 py-2 focus:outline-none"
            />
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-center mt-4 text-sm">
            <input
              id="terms"
              type="checkbox"
              class="mr-2"
              v-model="termsAccepted"
            />
            <label for="terms">
              {{ $t("agreeTo") }}
              <span class="text-primary font-bold underline cursor-pointer">
                {{ $t("termsAndConditions") }}
              </span>
            </label>
          </div>

          <!-- Start Button -->
          <div class="flex justify-end">
            <button
              @click="start"
              class="mt-6 flex items-center text-primary font-semibold hover:underline"
            >
              <svg
                class="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 12h14m-7-7l7 7-7 7"
                />
              </svg>
              <span>{{ $t("start") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Header from "./layouts/header.vue";
import Toast from "../../components/reUsableComponents/Toast.vue";
import { useLocaleStore } from "../../store/pinia/useLocaleStore";



export default {
  components: { Header, Toast },
  setup() {
    const mobileNumber = ref("");
    const termsAccepted = ref(false);
    const showWelcome = ref(false);
    const router = useRouter();

    // Access $refs using getCurrentInstance
    const { proxy } = getCurrentInstance();

    const formatEthiopianNumber = (number) => {
      const cleaned = number.replace(/\D/g, "");
      if (cleaned.startsWith("0") && cleaned.length === 10) {
        return "+251" + cleaned.substring(1);
      } else if (
        (cleaned.startsWith("7") || cleaned.startsWith("9")) &&
        cleaned.length === 9
      ) {
        return "+251" + cleaned;
      }
      return null;
    };

    const isValidEthiopianNumber = (number) => {
      const cleaned = number.replace(/\D/g, "");
      return (
        (cleaned.startsWith("0") && cleaned.length === 10) ||
        ((cleaned.startsWith("7") || cleaned.startsWith("9")) &&
          cleaned.length === 9)
      );
    };

    const start = async () => {
      if (!isValidEthiopianNumber(mobileNumber.value)) {
        proxy.$refs.toast.showErrorToastMessage(
          "Please enter a valid Ethiopian mobile number."
        );
        return;
      }

      const formattedNumber = formatEthiopianNumber(mobileNumber.value);
      console.log("formated number",formattedNumber);
      if (!termsAccepted.value) {
        proxy.$refs.toast.showErrorToastMessage(
          "You must agree to the Terms and Conditions"
        );
        return;
      }

      if (formattedNumber === "+251967740501") {
        console.log("formated is correct");
        localStorage.setItem("userPhone", formattedNumber);
        localStorage.setItem("otp_sent",true);
        router.push("/send-otp");
      } else {
        proxy.$refs.toast.showErrorToastMessage(
          "This phone is not registered "
        );
      }

      // try {
      //   const res = await axios.post(
      //     "https://10.57.40.118:8080/mobileInterface/rest/cardOTP",
      //     {
      //       operation: "send", // or "verify"
      //       type: "phone", // or "account"
      //       message: "Your generic OTP is @OTP",
      //       phone: formattedNumber, 
      //     }
      //   );

      //   console.log(res.data);



      //   if (res.data.status > 0) {
      //    // alert('ii');
      //     useLocaleStore().setOtpSent(true);
      //     useLocaleStore().setPhoneNumber(formattedNumber);
      //     router.push("/send-otp");
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

    onMounted(() => {
      showWelcome.value = true;
    });

    return {
      mobileNumber,
      termsAccepted,
      showWelcome,
      start,
    };
  },
};
</script>
