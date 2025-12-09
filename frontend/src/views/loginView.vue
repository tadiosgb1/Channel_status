<template>
  <div class="min-h-screen flex  justify-center bg-[#006523]/5 pt-2 pb-8">
    <div class="flex flex-col items-center justify-start bg-white w-full max-w-md h-auto shadow-lg h-">
      <!-- Header -->
      <div class="w-full bg-orange-500 text-white flex flex-col items-start px-6 py-4 relative">
        <div class="absolute top-2 left-4 text-sm text-white underline cursor-pointer">

        </div>
        <img src="@/assets/wegagen-logo.jpg" alt="Wegagen Bank Logo" class="h-12 mt-6" />
      </div>

      <!-- Welcome Message -->
     <div class="px-8 w-full">
        <div class="text-center mt-12">
        <h1 class="text-3xl font-semibold text-orange-500">Welcome!</h1>
      </div>

      <!-- Input Form -->
      <div class="mt-8 w-full">
        <div class="flex items-center border border-orange-500 rounded-md overflow-hidden">
          <span class="bg-gray-100 px-3 py-2 text-orange-500 font-semibold">+251</span>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            class="w-full px-4 py-2 focus:outline-none"
          />
        </div>

        <!-- Checkbox -->
        <div class="flex items-center mt-4 text-sm">
          <input id="terms" type="checkbox" class="mr-2" />
          <label for="terms" class="text-orange-500 ">
            Agree To
            <span class="text-orange-500 font-bold underline cursor-pointer">
              Terms And Conditions
            </span>
          </label>
        </div>

        <!-- Start Button -->
        <div class="flex justify-end">
          <router-link  to="/activate" class="mt-6 flex items-center text-orange-500 font-semibold hover:underline">
               <svg
              class="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path>
            </svg>

            <span>Start</span>
         
          </router-link>
  
        </div>
      </div>
     </div>
    </div>
  </div>
</template>
