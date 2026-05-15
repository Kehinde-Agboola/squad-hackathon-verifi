import api from './api';

export const adminService = {
  getOverview: async (): Promise<any> => {
    const response = await api.get('/admin/overview');
    return response.data;
  },

  getVendors: async (search?: string): Promise<any[]> => {
    const response = await api.get('/admin/vendors', {
      params: { search },
    });
    return response.data;
  },

  getFlagged: async (): Promise<any[]> => {
    const response = await api.get('/admin/flagged');
    return response.data;
  },

  suspendVendor: async (vendorId: string): Promise<any> => {
    const response = await api.post(`/admin/vendors/${vendorId}/suspend`);
    return response.data;
  },

  reverifyVendor: async (vendorId: string): Promise<any> => {
    const response = await api.post(`/admin/vendors/${vendorId}/reverify`);
    return response.data;
  },

  getSquadLedger: async (): Promise<any> => {
    const response = await api.get('/admin/squad-ledger');
    return response.data;
  },
};
