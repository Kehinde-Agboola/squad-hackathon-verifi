import { create } from 'zustand';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface CheckProgress {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  percentage: number;
  reason?: string;
}

interface VerifyStore {
  step: number;
  selectedType: string | null;
  selectedDocs: string[];
  uploadedFiles: UploadedFile[];
  verificationId: string | null;
  checkProgress: CheckProgress[];
  trustScore: number | null;

  setStep: (step: number) => void;
  setType: (type: string) => void;
  toggleDoc: (docId: string, isRequired: boolean) => void;
  addFile: (file: UploadedFile) => void;
  removeFile: (fileId: string) => void;
  setVerificationId: (id: string) => void;
  updateCheckProgress: (checks: CheckProgress[]) => void;
  setTrustScore: (score: number) => void;
  reset: () => void;
}

export const useVerifyStore = create<VerifyStore>((set) => ({
  step: 1,
  selectedType: null,
  selectedDocs: [],
  uploadedFiles: [],
  verificationId: null,
  checkProgress: [],
  trustScore: null,

  setStep: (step) => set({ step }),

  setType: (type) => set({ selectedType: type }),

  toggleDoc: (docId, isRequired) => {
    set((state) => {
      if (isRequired) return state;
      const isSelected = state.selectedDocs.includes(docId);
      return {
        selectedDocs: isSelected
          ? state.selectedDocs.filter((d) => d !== docId)
          : [...state.selectedDocs, docId],
      };
    });
  },

  addFile: (file) => set((state) => ({
    uploadedFiles: [...state.uploadedFiles, file],
  })),

  removeFile: (fileId) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId),
  })),

  setVerificationId: (id) => set({ verificationId: id }),

  updateCheckProgress: (checks) => set({ checkProgress: checks }),

  setTrustScore: (score) => set({ trustScore: score }),

  reset: () => set({
    step: 1,
    selectedType: null,
    selectedDocs: [],
    uploadedFiles: [],
    verificationId: null,
    checkProgress: [],
    trustScore: null,
  }),
}));
