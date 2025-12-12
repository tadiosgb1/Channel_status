<template>
  <aside class="w-64 bg-white border-r h-screen fixed shadow-md">
    <!-- Logo -->
    <div class="pt-2 flex flex-col px-4">
      <h1 class="text-2xl font-bold text-primary rounded">Wegagen Report</h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-8">
      <ul class="space-y-1">
        <li>
          <RouterLink
            :to="{ name: 'check-status' }"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('check-status') }"
          >
            <span class="mr-3"><i class="fa-solid fa-chart-line"></i></span>
            Check Status
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :to="{ name: 'create-users' }"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('create-users') }"
          >
            <span class="mr-3"><i class="fa-solid fa-user"></i></span>
            Create Users
          </RouterLink>
        </li>

        <li>
          <RouterLink
            :to="{ name: 'cases' }"
            class="flex items-center p-4 rounded-lg mx-3 text-gray-700 hover:bg-secondary hover:text-white transition-all"
            :class="{ 'bg-primary text-white font-semibold shadow-md': isActive('cases') }"
          >
            <span class="mr-3"><i class="fa-solid fa-briefcase"></i></span>
            Cases
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (name) => route.name === name;
</script>

<style scoped>
nav ul li a {
  transition: all 0.25s ease-out;
}
</style>

