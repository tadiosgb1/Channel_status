import { ref } from "vue";
import ApiService from "./ApiService";

export function useAccountList() {
  const accounts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const message = ref("");

  const fetchAccounts = async () => {
    const phoneNo = localStorage.getItem("userPhone");
    if (!phoneNo) {
      console.warn("No phone number found in localStorage");
      return;
    }

    loading.value = true;
    error.value = null;
    message.value = "";

    try {
      const payload = { phoneNo };
      const res = await ApiService.post(
        "AccountList/rest/accountList",
        payload
      );

      console.log("AccountList response:", res);


      if (res?.responsePayload?.accounts?.length) {
        accounts.value = res.responsePayload.accounts.map((accountStr) => {
          const parts = accountStr.split("#");
          return {
            full: accountStr,
            name: parts[0] || "",
            type: parts[1] || "",
            number: parts[2] || "",
            currency: parts[3] || "",
          };
        });
        message.value =
          res.responsePayload.desc || "Accounts loaded successfully";
      } else {
        accounts.value = [];
        message.value = "No accounts found";
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
      error.value = err;
      accounts.value = [];
      message.value = "Error fetching accounts";
    } finally {
      loading.value = false;
    }
  };

  return { accounts, loading, error, message, fetchAccounts };
}
