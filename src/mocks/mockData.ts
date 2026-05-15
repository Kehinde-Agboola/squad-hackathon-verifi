export const mockVendor = {
  id: 'vendor-001',
  firstName: 'Taiwo',
  lastName: 'Adeyemi',
  email: 'taiwo@example.com',
  businessName: 'Global Logistics Ltd',
  businessType: 'Transport',
  role: 'vendor',
  trustScore: 78,
  plan: 'growth',
  verificationStatus: 'verified',
};

export const mockAdmin = {
  id: 'admin-001',
  firstName: 'Chioma',
  lastName: 'Okafor',
  email: 'chioma@trustshield.io',
  role: 'admin',
};

export const mockVerifications = [
  {
    id: 'ver-001',
    vendorName: 'Global Logistics',
    type: 'Vendor KYB',
    date: '2024-05-10',
    score: 78,
    status: 'verified',
    checks: [
      { name: 'Document Verification', status: 'completed', percentage: 100 },
      { name: 'Liveness Check', status: 'completed', percentage: 100 },
      { name: 'Fraud Detection', status: 'completed', percentage: 100 },
      { name: 'Identity Match', status: 'completed', percentage: 100 },
      { name: 'Business Registry', status: 'completed', percentage: 100 },
    ],
  },
  {
    id: 'ver-002',
    vendorName: 'Tech Solutions Inc',
    type: 'Certificate Auth',
    date: '2024-05-09',
    score: 65,
    status: 'pending',
    checks: [
      { name: 'Document Verification', status: 'completed', percentage: 100 },
      { name: 'Liveness Check', status: 'in-progress', percentage: 65 },
      { name: 'Fraud Detection', status: 'pending', percentage: 0 },
    ],
  },
  {
    id: 'ver-003',
    vendorName: 'Fashion Hub Nigeria',
    type: 'Vendor KYB',
    date: '2024-05-08',
    score: 42,
    status: 'review',
    checks: [
      { name: 'Document Verification', status: 'completed', percentage: 100 },
      { name: 'Liveness Check', status: 'completed', percentage: 100 },
      { name: 'Fraud Detection', status: 'failed', percentage: 0 },
    ],
  },
];

export const mockDocuments = [
  {
    id: 'doc-001',
    name: 'CAC_Registration_2024.pdf',
    type: 'CAC Registration',
    date: '2024-05-01',
    size: '2.4 MB',
    status: 'verified',
  },
  {
    id: 'doc-002',
    name: 'TIN_Certificate.pdf',
    type: 'TIN Certificate',
    date: '2024-05-01',
    size: '1.8 MB',
    status: 'verified',
  },
  {
    id: 'doc-003',
    name: 'Business_Insurance_Policy.pdf',
    type: 'Business Insurance',
    date: '2024-04-30',
    size: '3.2 MB',
    status: 'verified',
  },
  {
    id: 'doc-004',
    name: 'Bank_Statement_March.pdf',
    type: 'Bank Statement',
    date: '2024-04-15',
    size: '1.5 MB',
    status: 'pending',
  },
];

export const mockBadge = {
  id: 'badge-001',
  vendorName: 'Global Logistics Ltd',
  businessId: 'GL-2024-001',
  trustScore: 78,
  verified: true,
  qrCode: 'https://trustshield-verify.com/gl-2024-001',
  embedCode:
    '<img src="https://api.trustshield.io/badges/badge-001.png" alt="TrustShield Badge" />',
  checks: [
    { name: 'Document Verification', status: 'passed' },
    { name: 'Liveness Check', status: 'passed' },
    { name: 'Fraud Detection', status: 'passed' },
    { name: 'Identity Match', status: 'passed' },
    { name: 'Business Registry', status: 'passed' },
  ],
};

export const mockBilling = {
  currentPlan: 'Growth - ₦80,000/month',
  verificationsThisMonth: 12,
  bondInEscrow: '₦180,000',
  nextBillingDate: '2024-06-01',
  transactions: [
    {
      id: 'txn-001',
      description: 'Monthly subscription - Growth plan',
      date: '2024-05-01',
      amount: 80000,
      status: 'completed',
    },
    {
      id: 'txn-002',
      description: 'Verification fee - Vendor KYB (ID: ver-001)',
      date: '2024-05-10',
      amount: 800,
      status: 'completed',
    },
    {
      id: 'txn-003',
      description: 'Verification fee - Certificate Auth (ID: ver-002)',
      date: '2024-05-09',
      amount: 600,
      status: 'completed',
    },
    {
      id: 'txn-004',
      description: 'Bond refund - Completed verification',
      date: '2024-05-05',
      amount: 15000,
      status: 'completed',
    },
  ],
};

export const mockOverview = {
  trustScore: 78,
  totalVerifications: 3,
  bondInEscrow: 180000,
  badgeStatus: 'verified',
  recentVerifications: mockVerifications.slice(0, 3),
  documentStatus: mockDocuments.slice(0, 3),
};

export const mockAdminOverview = {
  totalVerifications: 1247,
  passRate: 78,
  totalBondEscrow: 18700000,
  flaggedCount: 14,
  recentActivity: [
    {
      id: 'act-001',
      avatar: 'TA',
      vendorName: 'Taiwo Adeyemi',
      type: 'Vendor KYB',
      timeAgo: '5 mins ago',
      status: 'verified',
    },
    {
      id: 'act-002',
      avatar: 'AB',
      vendorName: 'Abike Babalola',
      type: 'Certificate Auth',
      timeAgo: '12 mins ago',
      status: 'pending',
    },
    {
      id: 'act-003',
      avatar: 'KJ',
      vendorName: 'Kunle Johnson',
      type: 'Identity Check',
      timeAgo: '28 mins ago',
      status: 'review',
    },
  ],
};

export const mockVendors = [
  {
    id: 'v-001',
    avatar: 'TA',
    name: 'Taiwo Adeyemi',
    type: 'Logistics',
    date: '2024-05-01',
    score: 78,
    status: 'verified',
  },
  {
    id: 'v-002',
    avatar: 'AB',
    name: 'Abike Babalola',
    type: 'E-commerce',
    date: '2024-04-28',
    score: 65,
    status: 'pending',
  },
  {
    id: 'v-003',
    avatar: 'KJ',
    name: 'Kunle Johnson',
    type: 'Technology',
    date: '2024-04-25',
    score: 42,
    status: 'review',
  },
];

export const mockFlagged = [
  {
    id: 'f-001',
    vendorName: 'Suspicious Trading Co',
    reason: 'Multiple failed verification attempts',
    riskLevel: 'High',
  },
  {
    id: 'f-002',
    vendorName: 'Quick Commerce Ltd',
    reason: 'Document mismatch detected',
    riskLevel: 'Medium',
  },
  {
    id: 'f-003',
    vendorName: 'Flash Delivery Services',
    reason: 'Duplicate business registration',
    riskLevel: 'High',
  },
];

export const mockWallet = {
  balance: 50000,
  currency: 'NGN',
  orgId: 'org-001',
};

export const mockTransactions = [
  {
    id: 'wtxn-001',
    type: 'credit',
    amount: 100000,
    description: 'Wallet top-up via Squad',
    status: 'completed',
    createdAt: '2024-05-10T10:00:00Z',
  },
  {
    id: 'wtxn-002',
    type: 'debit',
    amount: 5000,
    description: 'Vendor verification — Global Logistics Ltd',
    status: 'completed',
    createdAt: '2024-05-11T09:00:00Z',
  },
  {
    id: 'wtxn-003',
    type: 'debit',
    amount: 5000,
    description: 'Vendor verification — Tech Solutions Inc',
    status: 'completed',
    createdAt: '2024-05-12T11:30:00Z',
  },
];

export const mockOrgVendors = [
  {
    id: 'ov-001',
    businessName: 'Global Logistics Ltd',
    bankAccount: '0123456789',
    bankCode: '000013',
    contactEmail: 'contact@globallogistics.com',
    contactPhone: '08012345678',
    status: 'verified',
    trustScore: 85,
    checks: [],
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T12:00:00Z',
  },
  {
    id: 'ov-002',
    businessName: 'Tech Solutions Inc',
    bankAccount: '0987654321',
    bankCode: '000014',
    contactEmail: 'info@techsolutions.com',
    contactPhone: '08098765432',
    status: 'pending',
    trustScore: null,
    checks: null,
    createdAt: '2024-05-11T14:00:00Z',
    updatedAt: '2024-05-11T14:00:00Z',
  },
  {
    id: 'ov-003',
    businessName: 'Fashion Hub Nigeria',
    bankAccount: '1122334455',
    bankCode: '000015',
    contactEmail: 'hello@fashionhub.ng',
    contactPhone: '07012345678',
    status: 'failed',
    trustScore: 22,
    checks: [],
    createdAt: '2024-05-09T08:00:00Z',
    updatedAt: '2024-05-09T10:00:00Z',
  },
];

export const mockSquadLedger = {
  totalBondsHeld: 18700000,
  releasedThisMonth: 3200000,
  forfeitedFraud: 450000,
  platformRevenue: 2100000,
  transactions: [
    {
      id: 'ledg-001',
      icon: 'received',
      vendorName: 'Global Logistics',
      type: 'Bond Received',
      date: '2024-05-10',
      amount: 15000,
      status: 'completed',
    },
    {
      id: 'ledg-002',
      icon: 'forfeited',
      vendorName: 'Suspicious Trading',
      type: 'Bond Forfeited',
      date: '2024-05-08',
      amount: 25000,
      status: 'completed',
    },
    {
      id: 'ledg-003',
      icon: 'received',
      vendorName: 'Tech Solutions',
      type: 'Bond Received',
      date: '2024-05-07',
      amount: 8000,
      status: 'completed',
    },
  ],
};
