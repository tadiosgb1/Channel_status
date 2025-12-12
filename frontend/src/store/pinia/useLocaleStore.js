// stores/localeStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { i18n } from '@/main'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref('amharic');
  

  const isAuthenticated = ref(false);
  const isOtpSent = ref(false);
  const otpIsVerified = ref(false);


  const changeLocale = (locale) => {
    console.log('locale in change locale please', locale)
    currentLocale.value = locale
    i18n.global.locale.value = locale
    localStorage.setItem('app_locale', locale)
  }

  const loadSavedLocale = () => {
    const saved = localStorage.getItem('app_locale')
    if (saved) {
      changeLocale(saved)
    }
  }


  const setOtpSent = (value) => {
    isOtpSent.value = value;
    localStorage.setItem('isOtpSent', value);
  };

  const setPhoneNumber = (phoneNumber) => {
    localStorage.setItem('phoneNumber', phoneNumber);
  }

  const otpVerified = () => {
    otpIsVerified.value = true;
  }


  const getLocale = computed(() => currentLocale.value)
  const login = () => {
    isAuthenticated.value = true
    localStorage.setItem('isAuthenticated', true);
  }


  const logout = () => {
    isAuthenticated.value = false
    otpIsVerified.value = false;



    localStorage.removeItem('otpIsVerified');   
    localStorage.removeItem('isOtpSent');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('app_locale');

  }


  




  return {
    currentLocale,
    changeLocale,
    loadSavedLocale,
    login,
    isAuthenticated,
    getLocale,
    logout,
    setPhoneNumber,
    otpIsVerified,
    otpVerified ,
    isOtpSent,
    setOtpSent
  }
})
