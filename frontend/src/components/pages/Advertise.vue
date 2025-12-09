<template>
  <div class="flex items-center justify-center w-full bg-gray-100 p-4">
    <transition name="fade" mode="out-in">
      <img
        :key="currentImage"
        :src="currentImage"
        alt="Ad Image"
        class="w-full  object-contain rounded bg-white"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// Import local images
import a1 from "@/assets/img/a1.jpg";
import a2 from "@/assets/img/a2.jpg";
import a3 from "@/assets/img/a3.jpg";
import a4 from "@/assets/img/a4.jpg";

const images = [a1, a2, a3, a4];
const currentIndex = ref(0);
const intervalId = ref(null);

const currentImage = computed(() => images[currentIndex.value]);

const startCarousel = () => {
  intervalId.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 5000);
};

onMounted(() => {
  startCarousel();
});

onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
