import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DOCUMENT_TYPES } from '@/constants/verifyTypes';

interface Step2SelectDocsProps {
  selectedType: string;
  selectedDocs: string[];
  onToggleDoc: (docId: string) => void;
  onContinue: () => void;
}

export const Step2SelectDocs: React.FC<Step2SelectDocsProps> = ({
  selectedType,
  selectedDocs,
  onToggleDoc,
  onContinue,
}) => {
  const [hoveredRequired, setHoveredRequired] = useState<string | null>(null);
  const docs = DOCUMENT_TYPES[selectedType as keyof typeof DOCUMENT_TYPES] || [];
  const requiredDocs = docs.filter((d) => d.required);
  const selectedRequired = requiredDocs.filter((d) => selectedDocs.includes(d.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-ink mb-2">Select Documents</h2>
        <p className="text-muted">Choose which documents to upload for verification</p>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => {
          const isSelected = selectedDocs.includes(doc.id);
          const isRequired = doc.required;
          const canToggle = !isRequired;

          return (
            <div
              key={doc.id}
              onMouseEnter={() => isRequired && setHoveredRequired(doc.id)}
              onMouseLeave={() => setHoveredRequired(null)}
              className={`p-4 border border-border rounded-lg transition-all ${
                isSelected ? 'bg-primary-light border-primary' : 'bg-surface hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => canToggle && onToggleDoc(doc.id)}
                  disabled={!canToggle}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : isRequired
                      ? 'border-primary cursor-not-allowed'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  title={isRequired ? 'Required documents cannot be unchecked' : ''}
                >
                  {isSelected && <Check size={16} className="text-white" />}
                </button>
                <div className="flex-1">
                  <h3 className="font-medium text-ink">{doc.name}</h3>
                  <p className="text-sm text-muted mt-1">{doc.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    isRequired
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isRequired ? 'Required' : 'Optional'}
                </span>
              </div>
              {hoveredRequired === doc.id && isRequired && (
                <p className="text-xs text-red-600 mt-2">This document is required and cannot be unchecked</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-900">
          {selectedDocs.length} of {docs.length} documents selected
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={selectedRequired.length !== requiredDocs.length}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
