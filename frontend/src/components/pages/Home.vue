<template>
  <div>
    <div
      class="opacity-80 relative w-full p-6 rounded-bl-xl rounded-br-xl shadow-xl overflow-hidden bg-gradient-to-r from-[#ff6600] via-yellow-600 to-[#ff6600] text-white"
    >
      <!-- Many small circles in the background -->
      <div
        class="absolute inset-0 z-0 flex flex-wrap gap-2 px-4 py-6 opacity-20"
      >
        <template x-for="i in 100" :key="i">
          <div class="w-3 h-3 bg-yellow-300 rounded-full"></div>
        </template>
      </div>

      <!-- Content Section (z-10 so it's above the bubbles) -->
      <div class="relative z-10">
        <!-- Account Switcher -->
        <div class="relative group w-full mb-6 flex">
          <button
            id="accountSwitcherBtn"
            class="flex items-center gap-4 px-6 py-3 font-semibold transition rounded-md bg-opacity-90 hover:bg-orange-700"
            type="button"
            aria-expanded="false"
            aria-controls="accountList"
            onclick="toggleDropdown()"
          >
            <span id="selectedAccount">Saving *******30101</span>
            <i class="fas fa-chevron-down ml-2"></i>
          </button>

          <!-- Dropdown List -->
          <ul
            id="accountList"
            class="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden bg-[#cc5200] border border-orange-700 z-20 rounded-md max-h-60 overflow-auto w-80"
          >
            <li
              class="px-6 py-4 hover:bg-orange-700 cursor-pointer flex justify-between"
              onclick="selectAccount(this)"
            >
              <span class="flex items-center"
                ><i class="fas fa-piggy-bank mr-2"></i> Saving</span
              >
              <span class="text-sm" data-full="ETB 3,210.50">*******</span>
            </li>
            <li
              class="px-6 py-4 hover:bg-orange-700 cursor-pointer flex justify-between"
              onclick="selectAccount(this)"
            >
              <span class="flex items-center"
                ><i class="fas fa-piggy-bank mr-2"></i> Emergency Fund</span
              >
              <span class="text-sm" data-full="ETB 25,000.00"
                >*******30201</span
              >
            </li>
            <li
              class="px-6 py-4 hover:bg-orange-700 cursor-pointer flex justify-between"
              onclick="selectAccount(this)"
            >
              <span class="flex items-center"
                ><i class="fas fa-piggy-bank mr-2"></i> Investment</span
              >
              <span class="text-sm" data-full="ETB 100,000.00"
                >*******30301</span
              >
            </li>
          </ul>
        </div>

        <!-- Balance Section -->
        <div class="mb-6 text-center">
          <span class="block text-lg mb-1">Balance</span>
          <div class="flex items-center space-x-2 justify-center">
            <h2 id="balanceDisplay" class="text-2xl font-bold select-none">
              *******30101
            </h2>
            <h2 id="fullBalance" class="text-2xl font-bold select-none hidden">
              ETB 3,210.50
            </h2>
            <button
              id="toggleViewBtn"
              aria-label="Toggle balance visibility"
              class="hover:text-black focus:outline-none"
              onclick="toggleBalance()"
            >
              <i id="viewIcon" class="fas fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <section
      class="relative px-4 bg-white shadow-xl mx-4 rounded-lg border border-gray-200"
      style="margin-top: -50px"
    >
      <div class="flex space-x-3 overflow-x-auto pb-4 pt-4">
        <div
          class="min-w-[150px] bg-white shadow rounded-lg p-2 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <i class="fas fa-exchange-alt text-xl text-yellow-500 mb-1"></i>
          <h3
            class="text-gradient bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text font-bold text-sm"
          >
            Transfer
          </h3>
        </div>
        <div
          class="min-w-[150px] bg-white shadow rounded-lg p-2 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <h3
            class="text-gradient bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text font-bold text-sm flex items-center justify-center gap-1"
          >
            <i class="fas fa-money-check-alt text-sm"></i> Payment
          </h3>
        </div>
        <div
          class="min-w-[150px] bg-white shadow rounded-lg p-2 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <h3
            class="text-gradient bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text font-bold text-sm flex items-center justify-center gap-1"
          >
            <i class="fas fa-mobile-alt text-sm"></i> Top Up
          </h3>
        </div>
        <div
          class="min-w-[150px] bg-white shadow rounded-lg p-2 hover:shadow-lg cursor-pointer flex flex-col items-center text-center"
        >
          <h3
            class="text-gradient bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text font-bold text-sm flex items-center justify-center gap-1"
          >
            <i class="fas fa-users text-sm"></i> Others
          </h3>
        </div>
      </div>
    </section>
  </div>
</template>
<script></script>
