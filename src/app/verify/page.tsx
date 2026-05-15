'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/layout/TopNav';
import { Button } from '@/components/ui/Button';
import { StepHeader } from '@/components/stepper/StepHeader';
import { Step1ChooseType } from '@/components/stepper/Step1ChooseType';
import { Step2SelectDocs } from '@/components/stepper/Step2SelectDocs';
import { Step3Upload } from '@/components/stepper/Step3Upload';
import { Step4PayBond } from '@/components/stepper/Step4PayBond';
import { Step5Processing } from '@/components/stepper/Step5Processing';
import { useVerifyStore, UploadedFile } from '@/store/useVerifyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { useVerification } from '@/hooks/useVerification';
import { verifyService } from '@/services/verifyService';
import { DOCUMENT_TYPES } from '@/constants/verifyTypes';

export default function StepperPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { toasts, addToast, removeToast } = useToast();
  const [payLoading, setPayLoading] = useState(false);
  const [uploadedFilesList, setUploadedFilesList] = useState<(UploadedFile & { progress: number })[]>([]);

  const {
    step,
    selectedType,
    selectedDocs,
    uploadedFiles,
    verificationId,
    checkProgress,
    trustScore,
    setStep,
    setType,
    toggleDoc,
    addFile,
    removeFile,
    setVerificationId,
  } = useVerifyStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Use polling hook
  useVerification(verificationId, step === 5);

  // Simulate file upload
  const handleFilesAdded = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        const fileId = Math.random().toString(36).substr(2, 9);
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        addFile(uploadedFile);
        setUploadedFilesList((prev) => [
          ...prev,
          { ...uploadedFile, progress: 0 },
        ]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadedFilesList((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
            )
          );
        }, 300);
      });
    },
    [addFile]
  );

  const handlePay = async (bankCode: string, accountNumber: string) => {
    setPayLoading(true);
    try {
      // Get selected document list
      const docs = DOCUMENT_TYPES[selectedType as keyof typeof DOCUMENT_TYPES] || [];
      const docList = docs.map((d) => d.id);

      const response = await verifyService.initiate({
        type: selectedType || '',
        documents: docList,
        bankCode,
        accountNumber,
      });

      setVerificationId(response.verificationId);
      setStep(5);
      addToast('Payment initiated! Starting verification...', 'success');
    } catch (error: any) {
      addToast(
        error.response?.data?.message || 'Payment failed. Please try again.',
        'error'
      );
    } finally {
      setPayLoading(false);
    }
  };

  const steps: { number: number; label: string; status: 'done' | 'active' | 'todo' }[] = [
    { number: 1, label: 'Type', status: step > 1 ? 'done' : step === 1 ? 'active' : 'todo' },
    { number: 2, label: 'Documents', status: step > 2 ? 'done' : step === 2 ? 'active' : 'todo' },
    { number: 3, label: 'Upload', status: step > 3 ? 'done' : step === 3 ? 'active' : 'todo' },
    { number: 4, label: 'Payment', status: step > 4 ? 'done' : step === 4 ? 'active' : 'todo' },
    { number: 5, label: 'Processing', status: step === 5 ? 'active' : 'todo' },
  ];

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <StepHeader steps={steps} currentStep={step} />

          <div className="bg-surface border border-border rounded-lg p-8">
            {step === 1 && (
              <Step1ChooseType
                selectedType={selectedType}
                onSelectType={setType}
                onContinue={() => {
                  if (selectedType && selectedDocs.length === 0) {
                    // Pre-select required documents
                    const docs = DOCUMENT_TYPES[selectedType as keyof typeof DOCUMENT_TYPES] || [];
                    const required = docs.filter((d) => d.required).map((d) => d.id);
                    required.forEach((docId) => toggleDoc(docId, true));
                  }
                  setStep(2);
                }}
              />
            )}

            {step === 2 && selectedType && (
              <Step2SelectDocs
                selectedType={selectedType}
                selectedDocs={selectedDocs}
                onToggleDoc={(docId) => toggleDoc(docId, false)}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step3Upload
                uploadedFiles={uploadedFilesList}
                onFilesAdded={handleFilesAdded}
                onFileRemove={(fileId) => {
                  removeFile(fileId);
                  setUploadedFilesList((prev) => prev.filter((f) => f.id !== fileId));
                }}
                onContinue={() => setStep(4)}
              />
            )}

            {step === 4 && selectedType && (
              <Step4PayBond
                selectedType={selectedType}
                selectedDocCount={selectedDocs.length}
                onPay={handlePay}
                loading={payLoading}
              />
            )}

            {step === 5 && (
              <Step5Processing
                checks={checkProgress}
                trustScore={trustScore}
                processing={checkProgress.some((c) => c.status === 'in-progress')}
              />
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
