<template>
  <div v-if="visible" class="flex items-center justify-center w-full h-full">
    <div class="flex flex-col items-center space-y-2">
      <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
      <p v-if="message" class="text-sm text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
/* Optional: you can use Tailwind only */
</style>
