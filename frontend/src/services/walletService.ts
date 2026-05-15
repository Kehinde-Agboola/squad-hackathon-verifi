import api from './api';

export const walletService = {
  getWallet: async (orgId: string) => {
    const res = await api.get(`/wallet/${orgId}`);
    return res.data;
    // Returns: { balance, currency, orgId }
  },

  getTransactions: async (orgId: string) => {
    const res = await api.get(`/wallet/${orgId}/transactions`);
    return res.data;
    // Returns: array of transaction objects
  },

  topUp: async (orgId: string, amount: number) => {
    const res = await api.post(`/wallet/${orgId}/topup`, { amount });
    return res.data;
    // Returns: { checkoutUrl } or { checkout_url }
    // Frontend opens res.data.checkoutUrl || res.data.checkout_url in new tab
  },
};
