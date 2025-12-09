import axios from "axios";

const BASE_URL = "https://gateway.wegagentraining.com";

const apireq = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiService = {
  login: async (phone, password) => {
    try {
      const res = await apireq.post("/auth/login", { phone, password });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response) return err.response.data;
      return { description: "Network error", status: false };
    }
  },

  refreshToken: async () => {
    try {
      const res = await apireq.post("/auth/refresh");
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response) return err.response.data;
      return { description: "Network error", status: false };
    }
  },

  logout: async () => {
    try {
      const res = await apireq.post("/auth/logout");
      // if(res.data.status=true){
      //   this.$router.push('/login');
      // }\
      return res.data;

    } catch (err) {
      console.log(err);
      if (err.response) return err.response.data;
      return { description: "Network error", status: false };
    }
  },

  post: async (path, payload) => {

    console.log("path,payload",path,payload);

  try {
    const res = await apireq.post(`/gateway/${path}`, {payload});
    return res.data;
  } catch (err) {
    // First 401 check
    if (err.status === 401) {
      // Try refresh
      const refreshRes = await ApiService.refreshToken();

      console.log("refreshtoken response",refreshRes);

      if (refreshRes && refreshRes.status) {
        try {
          // Retry request after refresh
          const retryRes = await apireq.post(`/gateway/${path}`, payload);
          return retryRes.data;
        } catch (retryErr) {
          if (retryErr.status === 401) {
            //await ApiService.logout();
            return { description: "Unauthorized - logged out", status: false };
          }
          return retryErr.response?.data || { description: "Request failed", status: false };
        }
      } else {
        // Refresh failed → logout
        // await ApiService.logout();
        return { description: "Unauthorized - logged out", status: false };
      }
    }

    // Other errors
    return err.response?.data || { description: "Request failed", status: false };
  }
},

};

export default ApiService;
