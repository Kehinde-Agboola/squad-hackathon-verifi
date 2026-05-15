import api from './api';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    website?: string;
    industry: string;
    description?: string;
    webhookUrl?: string;
    contactPersonName: string;
    contactPersonRole: string;
    plan: string;
  }) => {
    const res = await api.post('/organisations/signup', data);
    return res.data;
    // Returns: { token, organisation }
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/organisations/login', data);
    return res.data;
    // Returns: { token, organisation }
  },

  getProfile: async () => {
    const res = await api.get('/organisations/profile');
    return res.data;
  },

  updateProfile: async (data: {
    phone?: string;
    website?: string;
    industry?: string;
    description?: string;
    webhookUrl?: string;
    contactPersonName?: string;
    contactPersonRole?: string;
    plan?: string;
  }) => {
    const res = await api.patch('/organisations/profile', data);
    return res.data;
  },

  regenerateApiKey: async () => {
    const res = await api.post('/organisations/regenerate-api-key');
    return res.data;
  },
};
