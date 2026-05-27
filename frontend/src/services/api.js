const API_BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: isFormData
      ? options.headers || {}
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "API request failed");
  }
  return data;
}

export const api = {
  health: () => request("/health"),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  verifyMfa: (payload) => request("/auth/verify-mfa", { method: "POST", body: JSON.stringify(payload) }),
  createCheckout: (payload) => request("/payment/create-checkout", { method: "POST", body: JSON.stringify(payload) }),
  confirmPayment: (payload) => request("/payment/confirm", { method: "POST", body: JSON.stringify(payload) }),
  uploadData: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/upload-data", { method: "POST", body: formData });
  },
  uploadedDataPreview: () => request("/uploaded-data-preview"),
  selectTarget: (payload) => request("/select-target", { method: "POST", body: JSON.stringify(payload) }),
  train: (payload) => request("/train", { method: "POST", body: JSON.stringify(payload) }),
  modelInputSchema: () => request("/model-input-schema"),
  modelMetrics: () => request("/model-metrics"),
  predict: (payload) => request("/predict", { method: "POST", body: JSON.stringify(payload) }),
  priceSensitivity: (payload) => request("/price-sensitivity", { method: "POST", body: JSON.stringify(payload) }),
  saveResult: (payload) => request("/save-result", { method: "POST", body: JSON.stringify(payload) }),
  savedResults: () => request("/saved-results"),
  dashboardSummary: () => request("/dashboard-summary"),
};
