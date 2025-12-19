import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'MicroFinance Pro',
    'app.tagline': 'Complete loan management solution for microfinance institutions. Manage borrowers, track loans, and streamline collections.',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.borrowers': 'Borrowers',
    'nav.loanTypes': 'Loan Types',
    'nav.loans': 'Loans',
    'nav.collections': 'Collections',
    'nav.staff': 'Staff & Agents',
    'nav.reports': 'Reports',
    'nav.logout': 'Logout',
    
    // Login
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Sign in to access your dashboard',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.usernamePlaceholder': 'Enter your username',
    'login.passwordPlaceholder': 'Enter your password',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing in...',
    'login.demoCredentials': 'Demo Credentials:',
    'login.admin': 'Admin',
    'login.staff': 'Staff',
    'login.agent': 'Agent',
    'login.error': 'Error',
    'login.errorBoth': 'Please enter both username and password',
    'login.welcomeMsg': 'Welcome!',
    'login.successMsg': 'You have successfully logged in',
    'login.failed': 'Login Failed',
    'login.invalidCredentials': 'Invalid username or password',
    'login.activeLoans': 'Active Loans',
    'login.totalDisbursed': 'Total Disbursed',
    'login.collectionRate': 'Collection Rate',
    'login.teamMembers': 'Team Members',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to MicroFinance Pro - Your loan management overview',
    'dashboard.totalBorrowers': 'Total Borrowers',
    'dashboard.activeLoans': 'Active Loans',
    'dashboard.totalDisbursed': 'Total Disbursed',
    'dashboard.totalCollected': 'Total Collected',
    'dashboard.todayCollection': "Today's Collection",
    'dashboard.collectionRate': 'Collection Rate',
    'dashboard.pendingEMIs': 'Pending EMIs',
    'dashboard.overdueAmount': 'Overdue Amount',
    'dashboard.recentLoans': 'Recent Loans',
    'dashboard.recentCollections': 'Recent Collections',
    'dashboard.loanNumber': 'Loan #',
    'dashboard.borrower': 'Borrower',
    'dashboard.amount': 'Amount',
    'dashboard.status': 'Status',
    'dashboard.collectionNumber': 'Collection #',
    'dashboard.date': 'Date',
    'dashboard.noLoans': 'No loans yet',
    'dashboard.noCollections': 'No collections yet',
    
    // Borrowers
    'borrowers.title': 'Borrowers',
    'borrowers.description': 'Manage your borrower database',
    'borrowers.addNew': 'Add Borrower',
    'borrowers.name': 'Name',
    'borrowers.phone': 'Phone',
    'borrowers.govtId': 'Govt ID',
    'borrowers.pan': 'PAN',
    'borrowers.address': 'Address',
    'borrowers.pinCode': 'PIN Code',
    'borrowers.gender': 'Gender',
    'borrowers.actions': 'Actions',
    'borrowers.edit': 'Edit',
    'borrowers.delete': 'Delete',
    'borrowers.noBorrowers': 'No borrowers found',
    
    // Loan Types
    'loanTypes.title': 'Loan Types',
    'loanTypes.description': 'Manage loan products and interest rates',
    'loanTypes.addNew': 'Add Loan Type',
    'loanTypes.typeName': 'Type Name',
    'loanTypes.interestRate': 'Interest Rate',
    'loanTypes.minAmount': 'Min Amount',
    'loanTypes.maxAmount': 'Max Amount',
    'loanTypes.frequency': 'Frequency',
    'loanTypes.noLoanTypes': 'No loan types found',
    
    // Loans
    'loans.title': 'Loans',
    'loans.description': 'Track and manage all loans',
    'loans.createNew': 'New Loan',
    'loans.loanNumber': 'Loan #',
    'loans.borrower': 'Borrower',
    'loans.principal': 'Principal',
    'loans.outstanding': 'Outstanding',
    'loans.emiAmount': 'EMI Amount',
    'loans.status': 'Status',
    'loans.noLoans': 'No loans found',
    'loans.active': 'Active',
    'loans.closed': 'Closed',
    'loans.overdue': 'Overdue',
    
    // Collections
    'collections.title': 'Collections',
    'collections.description': 'Record and track loan repayments',
    'collections.recordNew': 'Record Collection',
    'collections.collectionNumber': 'Collection #',
    'collections.loanNumber': 'Loan #',
    'collections.borrower': 'Borrower',
    'collections.amount': 'Amount',
    'collections.date': 'Date',
    'collections.collector': 'Collector',
    'collections.noCollections': 'No collections found',
    
    // Staff
    'staff.title': 'Staff & Agents',
    'staff.description': 'Manage staff members and collection agents',
    'staff.addNew': 'Add Staff',
    'staff.name': 'Name',
    'staff.role': 'Role',
    'staff.phone': 'Phone',
    'staff.email': 'Email',
    'staff.status': 'Status',
    'staff.noStaff': 'No staff members found',
    
    // Reports
    'reports.title': 'Reports',
    'reports.description': 'Business analytics and reporting',
    
    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.view': 'View',
    'action.search': 'Search...',
    
    // Language
    'language.english': 'English',
    'language.tamil': 'தமிழ்',
  },
  ta: {
    // Common
    'app.name': 'மைக்ரோ ஃபைனான்ஸ் ப்ரோ',
    'app.tagline': 'நுண்நிதி நிறுவனங்களுக்கான முழுமையான கடன் மேலாண்மை தீர்வு. கடன் வாங்குபவர்களை நிர்வகிக்கவும், கடன்களை கண்காணிக்கவும், வசூல்களை எளிதாக்கவும்.',
    
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.borrowers': 'கடன் வாங்குபவர்கள்',
    'nav.loanTypes': 'கடன் வகைகள்',
    'nav.loans': 'கடன்கள்',
    'nav.collections': 'வசூல்கள்',
    'nav.staff': 'ஊழியர்கள்',
    'nav.reports': 'அறிக்கைகள்',
    'nav.logout': 'வெளியேறு',
    
    // Login
    'login.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'login.subtitle': 'உங்கள் டாஷ்போர்டை அணுக உள்நுழையுங்கள்',
    'login.username': 'பயனர் பெயர்',
    'login.password': 'கடவுச்சொல்',
    'login.usernamePlaceholder': 'உங்கள் பயனர் பெயரை உள்ளிடுக',
    'login.passwordPlaceholder': 'உங்கள் கடவுச்சொல்லை உள்ளிடுக',
    'login.signIn': 'உள்நுழை',
    'login.signingIn': 'உள்நுழைகிறது...',
    'login.demoCredentials': 'டெமோ சான்றுகள்:',
    'login.admin': 'நிர்வாகி',
    'login.staff': 'ஊழியர்',
    'login.agent': 'முகவர்',
    'login.error': 'பிழை',
    'login.errorBoth': 'பயனர் பெயர் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்',
    'login.welcomeMsg': 'வரவேற்கிறோம்!',
    'login.successMsg': 'வெற்றிகரமாக உள்நுழைந்தீர்கள்',
    'login.failed': 'உள்நுழைவு தோல்வி',
    'login.invalidCredentials': 'தவறான பயனர் பெயர் அல்லது கடவுச்சொல்',
    'login.activeLoans': 'செயலில் உள்ள கடன்கள்',
    'login.totalDisbursed': 'மொத்த வழங்கியது',
    'login.collectionRate': 'வசூல் விகிதம்',
    'login.teamMembers': 'குழு உறுப்பினர்கள்',
    
    // Dashboard
    'dashboard.title': 'டாஷ்போர்டு',
    'dashboard.welcome': 'மைக்ரோஃபைனான்ஸ் ப்ரோவுக்கு வரவேற்கிறோம் - உங்கள் கடன் மேலாண்மை கண்ணோட்டம்',
    'dashboard.totalBorrowers': 'மொத்த கடன் வாங்குபவர்கள்',
    'dashboard.activeLoans': 'செயலில் உள்ள கடன்கள்',
    'dashboard.totalDisbursed': 'மொத்த வழங்கியது',
    'dashboard.totalCollected': 'மொத்த வசூலிப்பு',
    'dashboard.todayCollection': 'இன்றைய வசூல்',
    'dashboard.collectionRate': 'வசூல் விகிதம்',
    'dashboard.pendingEMIs': 'நிலுவையில் உள்ள EMI-கள்',
    'dashboard.overdueAmount': 'காலாவதியான தொகை',
    'dashboard.recentLoans': 'சமீபத்திய கடன்கள்',
    'dashboard.recentCollections': 'சமீபத்திய வசூல்கள்',
    'dashboard.loanNumber': 'கடன் #',
    'dashboard.borrower': 'கடன் வாங்குபவர்',
    'dashboard.amount': 'தொகை',
    'dashboard.status': 'நிலை',
    'dashboard.collectionNumber': 'வசூல் #',
    'dashboard.date': 'தேதி',
    'dashboard.noLoans': 'இன்னும் கடன்கள் இல்லை',
    'dashboard.noCollections': 'இன்னும் வசூல்கள் இல்லை',
    
    // Borrowers
    'borrowers.title': 'கடன் வாங்குபவர்கள்',
    'borrowers.description': 'உங்கள் கடன் வாங்குபவர் தரவுத்தளத்தை நிர்வகிக்கவும்',
    'borrowers.addNew': 'கடன் வாங்குபவர் சேர்',
    'borrowers.name': 'பெயர்',
    'borrowers.phone': 'தொலைபேசி',
    'borrowers.govtId': 'அரசு அடையாளம்',
    'borrowers.pan': 'பான்',
    'borrowers.address': 'முகவரி',
    'borrowers.pinCode': 'அஞ்சல் குறியீடு',
    'borrowers.gender': 'பாலினம்',
    'borrowers.actions': 'செயல்கள்',
    'borrowers.edit': 'திருத்து',
    'borrowers.delete': 'நீக்கு',
    'borrowers.noBorrowers': 'கடன் வாங்குபவர்கள் காணப்படவில்லை',
    
    // Loan Types
    'loanTypes.title': 'கடன் வகைகள்',
    'loanTypes.description': 'கடன் தயாரிப்புகள் மற்றும் வட்டி விகிதங்களை நிர்வகிக்கவும்',
    'loanTypes.addNew': 'கடன் வகை சேர்',
    'loanTypes.typeName': 'வகை பெயர்',
    'loanTypes.interestRate': 'வட்டி விகிதம்',
    'loanTypes.minAmount': 'குறைந்தபட்ச தொகை',
    'loanTypes.maxAmount': 'அதிகபட்ச தொகை',
    'loanTypes.frequency': 'அதிர்வெண்',
    'loanTypes.noLoanTypes': 'கடன் வகைகள் காணப்படவில்லை',
    
    // Loans
    'loans.title': 'கடன்கள்',
    'loans.description': 'அனைத்து கடன்களை கண்காணித்து நிர்வகிக்கவும்',
    'loans.createNew': 'புதிய கடன்',
    'loans.loanNumber': 'கடன் #',
    'loans.borrower': 'கடன் வாங்குபவர்',
    'loans.principal': 'அசல் தொகை',
    'loans.outstanding': 'நிலுவை',
    'loans.emiAmount': 'EMI தொகை',
    'loans.status': 'நிலை',
    'loans.noLoans': 'கடன்கள் காணப்படவில்லை',
    'loans.active': 'செயலில்',
    'loans.closed': 'முடிந்தது',
    'loans.overdue': 'காலாவதி',
    
    // Collections
    'collections.title': 'வசூல்கள்',
    'collections.description': 'கடன் திருப்பிச் செலுத்துதல்களை பதிவு செய்து கண்காணிக்கவும்',
    'collections.recordNew': 'வசூல் பதிவு',
    'collections.collectionNumber': 'வசூல் #',
    'collections.loanNumber': 'கடன் #',
    'collections.borrower': 'கடன் வாங்குபவர்',
    'collections.amount': 'தொகை',
    'collections.date': 'தேதி',
    'collections.collector': 'வசூலிப்பவர்',
    'collections.noCollections': 'வசூல்கள் காணப்படவில்லை',
    
    // Staff
    'staff.title': 'ஊழியர்கள் & முகவர்கள்',
    'staff.description': 'ஊழியர்கள் மற்றும் வசூல் முகவர்களை நிர்வகிக்கவும்',
    'staff.addNew': 'ஊழியர் சேர்',
    'staff.name': 'பெயர்',
    'staff.role': 'பணி',
    'staff.phone': 'தொலைபேசி',
    'staff.email': 'மின்னஞ்சல்',
    'staff.status': 'நிலை',
    'staff.noStaff': 'ஊழியர்கள் காணப்படவில்லை',
    
    // Reports
    'reports.title': 'அறிக்கைகள்',
    'reports.description': 'வணிக பகுப்பாய்வு மற்றும் அறிக்கையிடல்',
    
    // Common Actions
    'action.save': 'சேமி',
    'action.cancel': 'ரத்து செய்',
    'action.edit': 'திருத்து',
    'action.delete': 'நீக்கு',
    'action.view': 'பார்',
    'action.search': 'தேடு...',
    
    // Language
    'language.english': 'English',
    'language.tamil': 'தமிழ்',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
