<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  data() {
    return {
      inactivityTimeout: null,
      inactivityDuration: 600000, //60000, // 1 minute
      events: ["mousemove", "mousedown", "keypress", "touchstart"],
    };
  },
  created() {},
  mounted() {
    // console.log("[Mounted] Starting inactivity tracking...");
    this.startInactivityTracking();
  },
  beforeDestroy() {
    //console.log("[BeforeDestroy] Stopping inactivity tracking...");
    this.stopInactivityTracking();
    clearInterval(this.bankInterval);
  },
  methods: {
    startInactivityTracking() {
      //console.log("[StartTracking] Adding event listeners...");
      this.events.forEach((event) =>
        window.addEventListener(event, this.resetInactivityTimer)
      );
      this.resetInactivityTimer();
    },
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Stop tracking user inactivity by removing event listeners and clearing the timeout.
     * This is called when the user logs out or the component is destroyed.
     */
    /*******  4d15339b-71ba-4399-a6ca-844a6b57190d  *******/
    stopInactivityTracking() {
      // console.log(
      //   "[StopTracking] Removing event listeners and clearing timeout..."
      // );
      this.events.forEach((event) =>
        window.removeEventListener(event, this.resetInactivityTimer)
      );
      clearTimeout(this.inactivityTimeout);
    },
    resetInactivityTimer() {
      //console.log("[ResetTimer] User activity detected. Resetting timer...");
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(
        this.handleInactivity,
        this.inactivityDuration
      );
    },
    handleInactivity() {
      console.log("[Inactivity] No activity detected. Logging out...");
      if (this.$route.meta.requiresAuth) {
        // console.log("[Inactivity] Route requires auth. Proceeding to logout.");
        localStorage.removeItem("token");
        this.$store.dispatch("logout");
        this.$router.replace("/");
      } else {
        localStorage.removeItem("token");
        this.$store.dispatch("logout");
        this.$router.replace("/");
        // console.log(
        //   "[Inactivity] Current route does NOT require auth. Skipping logout."
        // );
      }
    },
  },
};
</script>
