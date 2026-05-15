export const VERIFICATION_TYPES = [
  {
    id: 'vendor-kyb',
    name: 'Vendor KYB',
    description: 'Know Your Business verification for vendor accounts',
    bond: 15000,
    icon: 'Store',
  },
  {
    id: 'certificate-auth',
    name: 'Certificate Auth',
    description: 'Verify business certifications and licenses',
    bond: 8000,
    icon: 'FileCheck',
  },
  {
    id: 'identity-check',
    name: 'Identity Check',
    description: 'Verify personal identity and credentials',
    bond: 5000,
    icon: 'User',
  },
  {
    id: 'employee-check',
    name: 'Employee Check',
    description: 'Background verification for employees',
    bond: 3000,
    icon: 'Users',
  },
];

export const DOCUMENT_TYPES = {
  'vendor-kyb': [
    { id: 'cac', name: 'CAC Registration', description: 'Corporate Affairs Commission certificate', required: true },
    { id: 'tin', name: 'TIN Certificate', description: 'Tax Identification Number certificate', required: true },
    { id: 'bank-statement', name: 'Bank Statement', description: 'Last 3 months bank statement', required: true },
    { id: 'id-document', name: 'ID Document', description: 'Valid government-issued ID', required: true },
    { id: 'business-address', name: 'Business Address Proof', description: 'Utility bill or lease agreement', required: false },
    { id: 'insurance', name: 'Business Insurance', description: 'Active insurance policy', required: false },
  ],
  'certificate-auth': [
    { id: 'cert-copy', name: 'Certificate Copy', description: 'Digital copy of certification', required: true },
    { id: 'issuer-verification', name: 'Issuer Verification', description: 'Confirmation from issuing body', required: false },
  ],
  'identity-check': [
    { id: 'id-front', name: 'ID Front', description: 'Front side of government ID', required: true },
    { id: 'id-back', name: 'ID Back', description: 'Back side of government ID', required: true },
    { id: 'selfie', name: 'Selfie', description: 'Recent selfie with ID', required: true },
  ],
  'employee-check': [
    { id: 'cv', name: 'CV/Resume', description: 'Current curriculum vitae', required: true },
    { id: 'references', name: 'References', description: 'Professional references', required: false },
  ],
};

export const AI_CHECKS = [
  { id: 'document-verification', name: 'Document Verification', description: 'AI verification of document authenticity' },
  { id: 'liveness-check', name: 'Liveness Check', description: 'Biometric liveness detection' },
  { id: 'fraud-detection', name: 'Fraud Detection', description: 'Machine learning fraud pattern analysis' },
  { id: 'identity-match', name: 'Identity Match', description: 'Facial recognition and identity matching' },
  { id: 'business-registry', name: 'Business Registry Check', description: 'Cross-reference with government databases' },
];

export const STATUS_COLORS = {
  verified: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  review: 'bg-blue-100 text-blue-700 border-blue-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  processing: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const PLAN_OPTIONS = [
  { id: 'starter', name: 'Starter', price: 25000, desc: 'For growing vendors' },
  { id: 'growth', name: 'Growth', price: 80000, desc: 'For scaling businesses' },
  { id: 'enterprise', name: 'Enterprise', price: null, desc: 'Custom pricing' },
];
