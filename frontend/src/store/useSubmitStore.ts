import { create } from 'zustand';

interface SubmitStore {
  step: number;
  businessName: string;
  bankAccount: string;
  bankCode: string;
  contactEmail: string;
  contactPhone: string;
  file: File | null;
  vendorId: string | null;

  setField: (key: string, value: string) => void;
  setFile: (file: File | null) => void;
  setStep: (step: number) => void;
  setVendorId: (vendorId: string | null) => void;
  reset: () => void;
}

export const useSubmitStore = create<SubmitStore>((set) => ({
  step: 1,
  businessName: '',
  bankAccount: '',
  bankCode: '',
  contactEmail: '',
  contactPhone: '',
  file: null,
  vendorId: null,

  setField: (key, value) => set({ [key]: value } as any),
  setFile: (file) => set({ file }),
  setStep: (step) => set({ step }),
  setVendorId: (vendorId) => set({ vendorId }),

  reset: () =>
    set({
      step: 1,
      businessName: '',
      bankAccount: '',
      bankCode: '',
      contactEmail: '',
      contactPhone: '',
      file: null,
      vendorId: null,
    }),
}));
