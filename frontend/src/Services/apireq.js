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
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response) return err.response.data;
      return { description: "Network error", status: false };
    }
  },

  sendGatewayRequest: async (path, payload) => {
    try {

      const res = await apireq.post(`/gateway/${path}`, { payload });
      return res.data;
    } catch (err) {
      console.log(err);
      if (err.response) return err.response.data;
      return { description: "Request failed", status: false };
    }
  },
};

export default ApiService;
