import React from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { VERIFICATION_TYPES } from '@/constants/verifyTypes';

interface Step1ChooseTypeProps {
  selectedType: string | null;
  onSelectType: (typeId: string) => void;
  onContinue: () => void;
}

const iconMap: { [key: string]: LucideIcon } = {
  Store: require('lucide-react').Store,
  FileCheck: require('lucide-react').FileCheck,
  User: require('lucide-react').User,
  Users: require('lucide-react').Users,
};

export const Step1ChooseType: React.FC<Step1ChooseTypeProps> = ({
  selectedType,
  onSelectType,
  onContinue,
}) => {
  const selectedData = VERIFICATION_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink mb-2">Choose Verification Type</h2>
        <p className="text-muted">Select the type of verification you need for this business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VERIFICATION_TYPES.map((type) => {
          const Icon = require('lucide-react')[type.icon];
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary bg-primary-light'
                  : 'border-border bg-surface hover:border-primary-light'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg flex-shrink-0 ${
                    isSelected ? 'bg-primary' : 'bg-primary-light'
                  }`}
                >
                  <Icon size={24} className={isSelected ? 'text-white' : 'text-primary'} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{type.name}</h3>
                  <p className="text-sm text-muted mt-1">{type.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">
                    Bond: ₦{type.bond.toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Refundable bond for {selectedData.name}: ₦{selectedData.bond.toLocaleString()} held in Squad escrow
            </p>
            <p className="text-xs text-blue-700 mt-1">
              This bond will be returned once verification is complete
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!selectedType}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
