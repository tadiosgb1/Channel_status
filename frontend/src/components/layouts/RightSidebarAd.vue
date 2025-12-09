<template>
  <div>
    <!-- Right Sidebar (Only for md and above) -->
    <div
      class="hidden md:block fixed top-1/3 right-3 transform -translate-y-1/2 w-[220px] -mt-5"
    >
      <div class="bg-gray-100 rounded p-2">
        <img
          :src="images[currentIndex]"
          alt="Ad"
          class="w-[200px] h-[200px] object-cover rounded"
        />
      </div>
    </div>

    <!-- Footer Ad (Only for mobile) -->
    <div
      class="block md:hidden fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-md w-full flex justify-center py-2 z-50"
    >
      <img
        :src="images[currentIndex]"
        alt="Ad"
        class="w-[200px] h-[200px] object-cover rounded"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "https://via.placeholder.com/200x200?text=Ad+1",
        "https://via.placeholder.com/200x200?text=Ad+2",
        "https://via.placeholder.com/200x200?text=Ad+3",
        "https://via.placeholder.com/200x200?text=Ad+4",
      ],
      currentIndex: 0,
      interval: null,
    };
  },
  mounted() {
    this.startAdRotation();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    startAdRotation() {
      this.interval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 6000); // Slower speed: change image every 6 seconds
    },
  },
};
</script>
