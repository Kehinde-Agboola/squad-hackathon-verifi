import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VERIFICATION_TYPES } from '@/constants/verifyTypes';

interface Step4PayBondProps {
  selectedType: string | null;
  selectedDocCount: number;
  onPay: (bankCode: string, accountNumber: string) => void;
  loading?: boolean;
}

const BANKS = [
  { code: 'GTB', name: 'Guaranty Trust Bank' },
  { code: 'ACCESS', name: 'Access Bank' },
  { code: 'ZENITH', name: 'Zenith Bank' },
  { code: 'FIRST', name: 'First Bank' },
  { code: 'UBA', name: 'United Bank for Africa' },
];

export const Step4PayBond: React.FC<Step4PayBondProps> = ({
  selectedType,
  selectedDocCount,
  onPay,
  loading = false,
}) => {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const verifyType = VERIFICATION_TYPES.find((t) => t.id === selectedType);
  const verificationFee = 800;
  const bondAmount = verifyType?.bond || 0;
  const totalAmount = verificationFee + bondAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankCode && accountNumber) {
      onPay(bankCode, accountNumber);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink mb-2">Review & Pay</h2>
        <p className="text-muted">Review the details and proceed with payment</p>
      </div>

      {/* Summary Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted mb-1">Verification Type</p>
            <p className="font-medium text-ink">{verifyType?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">Documents Selected</p>
            <p className="font-medium text-ink">{selectedDocCount} documents</p>
          </div>
        </div>

        <div className="border-t border-amber-300 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Verification fee</span>
            <span className="text-ink">₦{verificationFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Refundable bond</span>
            <span className="text-ink">₦{bondAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-amber-300">
            <span className="text-ink">Total Due</span>
            <span className="text-primary">₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bank Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Bank</label>
          <select
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Select your bank</option>
            {BANKS.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="0123456789"
            className="w-full px-4 py-2.5 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            Account name will be verified against your CAC business name via Squad before processing.
            Mismatches are instantly rejected.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={!bankCode || !accountNumber || loading}
            loading={loading}
            className="flex-1"
          >
            Pay with Squad
          </Button>
        </div>
      </form>
    </div>
  );
};
