import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
  status: 'done' | 'active' | 'todo';
}

interface StepHeaderProps {
  steps: Step[];
  currentStep: number;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Circle */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
              step.status === 'done'
                ? 'bg-primary text-white'
                : step.status === 'active'
                ? 'bg-primary-light border-2 border-primary text-primary'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step.status === 'done' ? <Check size={20} /> : step.number}
          </div>

          {/* Step Label */}
          <div className="flex-1 max-w-24">
            <p
              className={`text-xs font-medium text-center ${
                step.status === 'active' ? 'text-primary font-semibold' : 'text-muted'
              }`}
            >
              {step.label}
            </p>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 rounded-full transition-colors ${
                step.status === 'done' ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
