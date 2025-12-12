<template>
  <div>


    <!-- Action Buttons Section -->
    <section
      v-if="['transfer-home', 'payment-home', 'topup-home', 'others-home'].includes($route.name)"
      class="relative bg-white mx-4   "
      style="margin-top: -20px"
    >
      <div class="mt-5">
        <div class="grid grid-cols-4 gap-2 px-2 py-2">
          <div
            v-for="item in actions"
            :key="item.name"
            class="hover:bg-gray-100 bg-white rounded-md p-2 flex flex-col items-center text-center hover:shadow transition-colors cursor-pointer"
            @click="navigateTo(item.route)"
          >
            <div
              class="w-10 h-10 flex items-center justify-center rounded group-hover:bg-primary transition"
              :class="{
                'bg-primary': $route.name === item.route,
                'bg-territiary': $route.name !== item.route,
              }"
            >
              <i
                :class="[ item.icon, 'text-sm group-hover:text-white', $route.name === item.route ? 'text-white' : 'text-primary' ]"
              ></i>
            </div>
            <h3 class="text-gray-600 text-xs mt-1 font-semibold">
              {{ $t(item.label) }}
            </h3>
          </div>
        </div>
      </div>
    </section>

       <main class="flex-1 overflow-hidden min-h-0 overflow-y-auto">
        <div class="flex flex-col lg:flex-row bg-white px-3 mx-4">
          <div class="w-full">
            <slot>
              <router-view />
            </slot>
          </div>
        </div>
 
      </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAccountList } from '@/Services/useAccountList';
import axios from 'axios';
const { accounts, fetchAccounts } = useAccountList();
const router = useRouter();
const route = useRoute();
const selectedAccount = ref('');
const showDetails = ref(false);
const accountBalance = ref('ETB 0.00');
const actions = [
  { name: "transfer", route: "transfer-home", icon: "fas fa-exchange-alt", label: "transfer" },
  { name: "payment", route: "payment-home", icon: "fas fa-money-check-alt", label: "payment" },
  { name: "topup", route: "topup-home", icon: "fas fa-mobile-alt", label: "topUp" },
  { name: "others", route: "others-home", icon: "fas fa-users", label: "other" },
];
const selectedAccountBalance = computed(() => accountBalance.value);
const fetchBalance = async (accountNumber) => {
  if (!accountNumber) {
    accountBalance.value = "ETB 0.00";
    return;
  }

  try {
    const response = await axios.post('/api/BalanceInquery/rest/balance', {
      accountNumber: accountNumber
    });

    const result = response.data;
    if (result && result.balance) {
      accountBalance.value = `${result.currency || 'ETB'} ${result.balance}`;
    } else {
      accountBalance.value = "ETB 0.00";
    }
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    accountBalance.value = "ETB 0.00";
  }
};

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};

watch(selectedAccount, (newVal) => {
  const account = accounts.value.find(acc => acc.full === newVal);
  if (account) {
    fetchBalance(account.number);
  } else {
    accountBalance.value = "ETB 0.00";
  }
});

onMounted(async () => {
  await fetchAccounts();
  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0].full;
    fetchBalance(accounts.value[0].number);
  }
});
</script>
