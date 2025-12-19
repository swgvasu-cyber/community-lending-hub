import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Borrower, LoanType, Loan, Collection, Staff, DashboardStats } from '@/types';

interface DataContextType {
  // Borrowers
  borrowers: Borrower[];
  addBorrower: (borrower: Omit<Borrower, 'id' | 'code' | 'createdAt'>) => void;
  updateBorrower: (id: string, borrower: Partial<Borrower>) => void;
  deleteBorrower: (id: string) => void;

  // Loan Types
  loanTypes: LoanType[];
  addLoanType: (loanType: Omit<LoanType, 'id' | 'createdAt'>) => void;
  updateLoanType: (id: string, loanType: Partial<LoanType>) => void;
  deleteLoanType: (id: string) => void;

  // Loans
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'loanNumber' | 'createdAt' | 'emiAmount' | 'totalInterest' | 'totalAmount' | 'remainingBalance' | 'totalPaid'>) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  closeLoan: (id: string) => void;

  // Collections
  collections: Collection[];
  addCollection: (collection: Omit<Collection, 'id' | 'collectionNumber' | 'createdAt'>) => void;

  // Staff
  staff: Staff[];
  addStaff: (staff: Omit<Staff, 'id' | 'employeeCode'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Stats
  getStats: () => DashboardStats;

  // Loan calculations
  calculateEMI: (principal: number, rate: number, tenure: number, frequency: 'daily' | 'weekly' | 'monthly') => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial demo data
const initialBorrowers: Borrower[] = [
  {
    id: '1',
    code: 'BOR001',
    fullName: 'Prakash Sharma',
    displayName: 'Prakash',
    gender: 'male',
    phone: '9876543214',
    email: 'prakash@email.com',
    govtId: '1234-5678-9012',
    pan: '33BMQPR2946K1ZF',
    address: '155, Nehru Nagar, Main Road',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pinCode: '625850',
    createdAt: new Date('2025-12-15'),
    createdBy: '1',
  },
  {
    id: '2',
    code: 'BOR002',
    fullName: 'Hanisha Enterprises',
    displayName: 'Hanisha',
    gender: 'other',
    phone: '9876543215',
    govtId: '9876-5432-1098',
    pan: '33BRJPK9386C1ZK',
    address: 'No.24, Vaniyambadi Taluk, Chinnavarikam Village',
    city: 'Vellore',
    state: 'Tamil Nadu',
    pinCode: '600007',
    createdAt: new Date('2025-07-04'),
    createdBy: '1',
  },
  {
    id: '3',
    code: 'BOR003',
    fullName: 'Sri Sai Traders',
    displayName: 'Sri Sai',
    gender: 'other',
    phone: '9876543220',
    govtId: '5555-6666-7777',
    pan: '33BMQPR2946K1ZF',
    address: '46, NEEK Main Road, Sholavandhan',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pinCode: '625214',
    createdAt: new Date('2025-09-10'),
    createdBy: '1',
  },
];

const initialLoanTypes: LoanType[] = [
  {
    id: '1',
    name: 'Business Loan',
    description: 'Short-term working capital for small businesses',
    interestRate: 18,
    minAmount: 10000,
    maxAmount: 500000,
    minTenure: 3,
    maxTenure: 24,
    repaymentFrequency: 'monthly',
    processingFee: 2,
    createdAt: new Date('2025-12-09'),
  },
  {
    id: '2',
    name: 'Daily Collection Loan',
    description: 'Daily repayment micro loans for vendors',
    interestRate: 24,
    minAmount: 5000,
    maxAmount: 100000,
    minTenure: 30,
    maxTenure: 100,
    repaymentFrequency: 'daily',
    processingFee: 1.5,
    createdAt: new Date('2025-12-16'),
  },
  {
    id: '3',
    name: 'Weekly Loan',
    description: 'Weekly repayment loans for regular earners',
    interestRate: 20,
    minAmount: 10000,
    maxAmount: 200000,
    minTenure: 12,
    maxTenure: 52,
    repaymentFrequency: 'weekly',
    processingFee: 1.5,
    createdAt: new Date('2025-12-16'),
  },
];

const initialStaff: Staff[] = [
  { id: '1', employeeCode: 'EMP001', fullName: 'Ravi Kumar', role: 'staff', phone: '9876543211', email: 'ravi@microfinance.com', address: 'Chennai', joiningDate: new Date('2024-01-15'), status: 'active' },
  { id: '2', employeeCode: 'EMP002', fullName: 'Priya Devi', role: 'staff', phone: '9876543221', email: 'priya@microfinance.com', address: 'Chennai', joiningDate: new Date('2024-02-20'), status: 'active' },
  { id: '3', employeeCode: 'EMP003', fullName: 'Kumar S', role: 'staff', phone: '9876543222', email: 'kumar@microfinance.com', address: 'Madurai', joiningDate: new Date('2024-03-10'), status: 'active' },
  { id: '4', employeeCode: 'EMP004', fullName: 'Lakshmi R', role: 'staff', phone: '9876543223', email: 'lakshmi@microfinance.com', address: 'Coimbatore', joiningDate: new Date('2024-04-01'), status: 'active' },
  { id: '5', employeeCode: 'EMP005', fullName: 'Venkat P', role: 'staff', phone: '9876543224', email: 'venkat@microfinance.com', address: 'Salem', joiningDate: new Date('2024-05-15'), status: 'active' },
  { id: '6', employeeCode: 'AGT001', fullName: 'Suresh Patel', role: 'agent', phone: '9876543212', email: 'suresh@microfinance.com', address: 'Chennai', joiningDate: new Date('2024-01-20'), status: 'active', assignedLoansCount: 15, totalCollected: 250000 },
  { id: '7', employeeCode: 'AGT002', fullName: 'Ramesh K', role: 'agent', phone: '9876543213', email: 'ramesh@microfinance.com', address: 'Madurai', joiningDate: new Date('2024-02-01'), status: 'active', assignedLoansCount: 12, totalCollected: 180000 },
  { id: '8', employeeCode: 'AGT003', fullName: 'Ganesh M', role: 'agent', phone: '9876543225', email: 'ganesh@microfinance.com', address: 'Trichy', joiningDate: new Date('2024-02-15'), status: 'active', assignedLoansCount: 18, totalCollected: 320000 },
  { id: '9', employeeCode: 'AGT004', fullName: 'Murugan S', role: 'agent', phone: '9876543226', email: 'murugan@microfinance.com', address: 'Salem', joiningDate: new Date('2024-03-01'), status: 'active', assignedLoansCount: 10, totalCollected: 150000 },
  { id: '10', employeeCode: 'AGT005', fullName: 'Karthik R', role: 'agent', phone: '9876543227', email: 'karthik@microfinance.com', address: 'Coimbatore', joiningDate: new Date('2024-03-15'), status: 'active', assignedLoansCount: 14, totalCollected: 220000 },
  { id: '11', employeeCode: 'AGT006', fullName: 'Selvam P', role: 'agent', phone: '9876543228', email: 'selvam@microfinance.com', address: 'Erode', joiningDate: new Date('2024-04-01'), status: 'active', assignedLoansCount: 8, totalCollected: 95000 },
  { id: '12', employeeCode: 'AGT007', fullName: 'Vijay K', role: 'agent', phone: '9876543229', email: 'vijay@microfinance.com', address: 'Tirunelveli', joiningDate: new Date('2024-04-15'), status: 'active', assignedLoansCount: 11, totalCollected: 175000 },
  { id: '13', employeeCode: 'AGT008', fullName: 'Arjun M', role: 'agent', phone: '9876543230', email: 'arjun@microfinance.com', address: 'Vellore', joiningDate: new Date('2024-05-01'), status: 'active', assignedLoansCount: 9, totalCollected: 130000 },
  { id: '14', employeeCode: 'AGT009', fullName: 'Deepak S', role: 'agent', phone: '9876543231', email: 'deepak@microfinance.com', address: 'Thanjavur', joiningDate: new Date('2024-05-15'), status: 'active', assignedLoansCount: 13, totalCollected: 200000 },
  { id: '15', employeeCode: 'AGT010', fullName: 'Manoj R', role: 'agent', phone: '9876543232', email: 'manoj@microfinance.com', address: 'Dindigul', joiningDate: new Date('2024-06-01'), status: 'active', assignedLoansCount: 7, totalCollected: 85000 },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [borrowers, setBorrowers] = useState<Borrower[]>(initialBorrowers);
  const [loanTypes, setLoanTypes] = useState<LoanType[]>(initialLoanTypes);
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      loanNumber: 'LN00001',
      borrowerId: '1',
      borrowerName: 'Prakash Sharma',
      loanTypeId: '2',
      loanTypeName: 'Daily Collection Loan',
      principalAmount: 70000,
      interestRate: 24,
      tenure: 100,
      repaymentFrequency: 'daily',
      emiAmount: 840,
      totalInterest: 14000,
      totalAmount: 84000,
      processingFee: 1050,
      netDisbursed: 68950,
      disbursementDate: new Date('2025-12-16'),
      startDate: new Date('2025-12-17'),
      endDate: new Date('2026-03-26'),
      status: 'active',
      totalPaid: 25200,
      remainingBalance: 58800,
      assignedAgentId: '6',
      assignedAgentName: 'Suresh Patel',
      createdBy: '1',
      createdAt: new Date('2025-12-16'),
    },
    {
      id: '2',
      loanNumber: 'LN00002',
      borrowerId: '2',
      borrowerName: 'Hanisha Enterprises',
      loanTypeId: '1',
      loanTypeName: 'Business Loan',
      principalAmount: 200000,
      interestRate: 18,
      tenure: 12,
      repaymentFrequency: 'monthly',
      emiAmount: 18334,
      totalInterest: 20008,
      totalAmount: 220008,
      processingFee: 4000,
      netDisbursed: 196000,
      disbursementDate: new Date('2025-11-01'),
      startDate: new Date('2025-12-01'),
      endDate: new Date('2026-11-01'),
      status: 'active',
      totalPaid: 18334,
      remainingBalance: 201674,
      assignedAgentId: '7',
      assignedAgentName: 'Ramesh K',
      createdBy: '1',
      createdAt: new Date('2025-11-01'),
    },
  ]);
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      collectionNumber: 'COL00001',
      loanId: '1',
      loanNumber: 'LN00001',
      borrowerId: '1',
      borrowerName: 'Prakash Sharma',
      borrowerPhone: '9876543214',
      collectionDate: new Date('2025-12-17'),
      payDate: new Date('2025-12-17'),
      installmentNumber: 1,
      expectedAmount: 840,
      collectedAmount: 840,
      balanceAmount: 0,
      paymentMode: 'cash',
      agentId: '6',
      agentName: 'Suresh Patel',
      createdAt: new Date('2025-12-17'),
    },
  ]);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);

  const calculateEMI = (principal: number, annualRate: number, tenure: number, frequency: 'daily' | 'weekly' | 'monthly'): number => {
    let periodsPerYear: number;
    switch (frequency) {
      case 'daily': periodsPerYear = 365; break;
      case 'weekly': periodsPerYear = 52; break;
      case 'monthly': periodsPerYear = 12; break;
    }
    
    const periodicRate = annualRate / 100 / periodsPerYear;
    const totalPeriods = tenure;
    
    if (periodicRate === 0) return principal / totalPeriods;
    
    const emi = (principal * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
                (Math.pow(1 + periodicRate, totalPeriods) - 1);
    
    return Math.round(emi * 100) / 100;
  };

  const addBorrower = (borrower: Omit<Borrower, 'id' | 'code' | 'createdAt'>) => {
    const newBorrower: Borrower = {
      ...borrower,
      id: Date.now().toString(),
      code: `BOR${String(borrowers.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
    };
    setBorrowers([...borrowers, newBorrower]);
  };

  const updateBorrower = (id: string, updates: Partial<Borrower>) => {
    setBorrowers(borrowers.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBorrower = (id: string) => {
    setBorrowers(borrowers.filter((b) => b.id !== id));
  };

  const addLoanType = (loanType: Omit<LoanType, 'id' | 'createdAt'>) => {
    const newLoanType: LoanType = {
      ...loanType,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setLoanTypes([...loanTypes, newLoanType]);
  };

  const updateLoanType = (id: string, updates: Partial<LoanType>) => {
    setLoanTypes(loanTypes.map((lt) => (lt.id === id ? { ...lt, ...updates } : lt)));
  };

  const deleteLoanType = (id: string) => {
    setLoanTypes(loanTypes.filter((lt) => lt.id !== id));
  };

  const addLoan = (loanData: Omit<Loan, 'id' | 'loanNumber' | 'createdAt' | 'emiAmount' | 'totalInterest' | 'totalAmount' | 'remainingBalance' | 'totalPaid'>) => {
    const emi = calculateEMI(loanData.principalAmount, loanData.interestRate, loanData.tenure, loanData.repaymentFrequency);
    const totalAmount = emi * loanData.tenure;
    const totalInterest = totalAmount - loanData.principalAmount;

    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      loanNumber: `LN${String(loans.length + 1).padStart(5, '0')}`,
      emiAmount: emi,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      remainingBalance: Math.round(totalAmount * 100) / 100,
      totalPaid: 0,
      createdAt: new Date(),
    };
    setLoans([...loans, newLoan]);
  };

  const updateLoan = (id: string, updates: Partial<Loan>) => {
    setLoans(loans.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const closeLoan = (id: string) => {
    updateLoan(id, { status: 'closed' });
  };

  const addCollection = (collectionData: Omit<Collection, 'id' | 'collectionNumber' | 'createdAt'>) => {
    const newCollection: Collection = {
      ...collectionData,
      id: Date.now().toString(),
      collectionNumber: `COL${String(collections.length + 1).padStart(5, '0')}`,
      createdAt: new Date(),
    };
    setCollections([...collections, newCollection]);

    // Update loan
    const loan = loans.find((l) => l.id === collectionData.loanId);
    if (loan) {
      const newTotalPaid = loan.totalPaid + collectionData.collectedAmount;
      const newRemaining = loan.totalAmount - newTotalPaid;
      updateLoan(loan.id, {
        totalPaid: newTotalPaid,
        remainingBalance: newRemaining,
        status: newRemaining <= 0 ? 'closed' : loan.status,
      });
    }
  };

  const addStaff = (staffData: Omit<Staff, 'id' | 'employeeCode'>) => {
    const prefix = staffData.role === 'agent' ? 'AGT' : 'EMP';
    const count = staff.filter((s) => s.role === staffData.role).length + 1;
    const newStaff: Staff = {
      ...staffData,
      id: Date.now().toString(),
      employeeCode: `${prefix}${String(count).padStart(3, '0')}`,
    };
    setStaff([...staff, newStaff]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(staff.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const getStats = (): DashboardStats => {
    const activeLoans = loans.filter((l) => l.status === 'active');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCollections = collections.filter((c) => {
      const colDate = new Date(c.collectionDate);
      colDate.setHours(0, 0, 0, 0);
      return colDate.getTime() === today.getTime();
    });

    const totalDisbursed = loans.reduce((sum, l) => sum + l.netDisbursed, 0);
    const totalCollected = collections.reduce((sum, c) => sum + c.collectedAmount, 0);
    const todayCollection = todayCollections.reduce((sum, c) => sum + c.collectedAmount, 0);
    const overdueAmount = activeLoans.filter((l) => l.status === 'overdue').reduce((sum, l) => sum + l.remainingBalance, 0);

    return {
      totalBorrowers: borrowers.length,
      activeLoans: activeLoans.length,
      totalDisbursed,
      totalCollected,
      todayCollection,
      overdueAmount,
      collectionRate: totalDisbursed > 0 ? (totalCollected / totalDisbursed) * 100 : 0,
      pendingInstallments: activeLoans.reduce((sum, l) => sum + Math.ceil(l.remainingBalance / l.emiAmount), 0),
    };
  };

  return (
    <DataContext.Provider
      value={{
        borrowers,
        addBorrower,
        updateBorrower,
        deleteBorrower,
        loanTypes,
        addLoanType,
        updateLoanType,
        deleteLoanType,
        loans,
        addLoan,
        updateLoan,
        closeLoan,
        collections,
        addCollection,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        getStats,
        calculateEMI,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
