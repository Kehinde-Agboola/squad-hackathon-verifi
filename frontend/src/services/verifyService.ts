import api from './api';

export const verifyService = {
  initiate: async (data: {
    type: string;
    documents: string[];
    bankCode: string;
    accountNumber: string;
  }): Promise<{ verificationId: string; checkoutUrl: string }> => {
    const response = await api.post('/verifications/initiate', data);
    return response.data;
  },

  uploadDocuments: async (verificationId: string, files: FormData): Promise<{ success: boolean }> => {
    const response = await api.post(`/verifications/${verificationId}/upload`, files, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getStatus: async (verificationId: string): Promise<any> => {
    const response = await api.get(`/verifications/${verificationId}/status`);
    return response.data;
  },

  getVerifications: async (): Promise<any[]> => {
    const response = await api.get('/verifications');
    return response.data;
  },
};
