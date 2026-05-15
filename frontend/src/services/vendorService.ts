import api from './api';

export const vendorService = {
  // ── New org-facing endpoints ────────────────────────────────────
  submitVendor: async (formData: FormData) => {
    // Content-Type NOT set manually — axios sets multipart boundary automatically
    const res = await api.post('/vendors/verify', formData);
    return res.data;
  },

  getVendors: async () => {
    const res = await api.get('/vendors');
    return res.data;
  },

  // ── Legacy vendor-dashboard endpoints (kept for /dashboard/vendor) ──
  getOverview: async (): Promise<any> => {
    const response = await api.get('/vendors/me/overview');
    return response.data;
  },

  getVerifications: async (): Promise<any[]> => {
    const response = await api.get('/vendors/me/verifications');
    return response.data;
  },

  getDocuments: async (): Promise<any[]> => {
    const response = await api.get('/vendors/me/documents');
    return response.data;
  },

  uploadDocument: async (files: FormData): Promise<any> => {
    const response = await api.post('/vendors/me/documents', files);
    return response.data;
  },

  downloadDocument: async (documentId: string): Promise<void> => {
    window.location.href = `${api.defaults.baseURL}/vendors/me/documents/${documentId}/download`;
  },

  getBadge: async (): Promise<any> => {
    const response = await api.get('/vendors/me/badge');
    return response.data;
  },

  getBilling: async (): Promise<any> => {
    const response = await api.get('/vendors/me/billing');
    return response.data;
  },
};
