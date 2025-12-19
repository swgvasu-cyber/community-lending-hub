export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'admin' | 'staff' | 'agent';
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Borrower {
  id: string;
  code: string;
  fullName: string;
  displayName: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  govtId: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  createdAt: Date;
  createdBy: string;
}

export interface LoanType {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  repaymentFrequency: 'daily' | 'weekly' | 'monthly';
  processingFee: number;
  createdAt: Date;
}

export interface Loan {
  id: string;
  loanNumber: string;
  borrowerId: string;
  borrowerName: string;
  loanTypeId: string;
  loanTypeName: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  repaymentFrequency: 'daily' | 'weekly' | 'monthly';
  emiAmount: number;
  totalInterest: number;
  totalAmount: number;
  processingFee: number;
  netDisbursed: number;
  disbursementDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'closed' | 'overdue' | 'defaulted';
  totalPaid: number;
  remainingBalance: number;
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Collection {
  id: string;
  collectionNumber: string;
  loanId: string;
  loanNumber: string;
  borrowerId: string;
  borrowerName: string;
  borrowerPhone: string;
  collectionDate: Date;
  payDate: Date;
  installmentNumber: number;
  expectedAmount: number;
  collectedAmount: number;
  balanceAmount: number;
  paymentMode: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  agentId: string;
  agentName: string;
  remarks?: string;
  createdAt: Date;
}

export interface Staff {
  id: string;
  employeeCode: string;
  fullName: string;
  role: 'staff' | 'agent';
  phone: string;
  email: string;
  address: string;
  joiningDate: Date;
  status: 'active' | 'inactive';
  assignedLoansCount?: number;
  totalCollected?: number;
}

export interface DashboardStats {
  totalBorrowers: number;
  activeLoans: number;
  totalDisbursed: number;
  totalCollected: number;
  todayCollection: number;
  overdueAmount: number;
  collectionRate: number;
  pendingInstallments: number;
}
