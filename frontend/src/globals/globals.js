import axios from "axios";
import { Logger } from "../utils/logger";
import {
  reloadPage, apiGet, apiGetById, apiPost, apiPut,
  apiPatch, apiDelete, isStrongPassword, validateField,
  gregorianToEthiopian, getPdfBlobUrl, base64ToFile,
  processFilesToAdd, triggerFileInput, handleFileInput, toggleDragState, removeAttachment,
  handleAnyFileInput, convertImageToBase64,getInternalInfo,getDonationList
} from "../utils/utils"; // Adjust the path to match your project structure

export default {
  async install(app) {
    const pixel = {
      mobile: 430,      // max width for mobile
      tablet: 800,      // max width for tablet
      pc_lap: 801     // min width for computer
    };


    // Check environment and set base URL
    const isProduction = import.meta.env.MODE === "production";
    const baseUrl = isProduction
      ? import.meta.env.VITE_APP_BASE_URL_PRODUCTION
      : import.meta.env.VITE_APP_BASE_URL_LOCAL;
    // Create the API client
    const apiClient = axios.create({
      baseURL: baseUrl,
    });

    // Generate the array of years (from now - 5 years up to now + 50 years)


    const globalProperties = {
      $pixel: pixel,
      $apiClient: apiClient,
      $getInternalInfo:getInternalInfo,
      $getDonationList:getDonationList,

      $reloadPage: reloadPage,
      $apiGet: apiGet,
      $apiGetById: apiGetById,
      $apiPost: apiPost,
      $apiPut: apiPut,
      $apiPatch: apiPatch,
      $apiDelete: apiDelete,
      $isStrongPassword: isStrongPassword,
      $validateField: validateField,
      $gcEthio: gregorianToEthiopian,
      $getPdfBlobUrl: getPdfBlobUrl,
      $base64ToFile: base64ToFile,
      $processFilesToAdd: processFilesToAdd,
      $triggerFileInput: triggerFileInput,
      $handleFileInput: handleFileInput,
      $toggleDragState: toggleDragState,
      $removeAttachment: removeAttachment,
      $handleAnyFileInput: handleAnyFileInput,
      $logger: Logger,
      $convertImageToBase64: convertImageToBase64,
    };
    // Assign to the global properties in the Vue app
    app.config.globalProperties = {
      ...app.config.globalProperties,
      ...globalProperties,
    };
  },
};
