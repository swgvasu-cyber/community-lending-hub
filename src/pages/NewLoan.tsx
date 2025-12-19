import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Save, ArrowLeft } from 'lucide-react';

export default function NewLoan() {
  const { borrowers, loanTypes, staff, addLoan, calculateEMI } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    borrowerId: '',
    loanTypeId: '',
    principalAmount: '',
    tenure: '',
    disbursementDate: new Date().toISOString().split('T')[0],
    assignedAgentId: '',
  });

  const [calculations, setCalculations] = useState({
    interestRate: 0,
    repaymentFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    processingFee: 0,
    emiAmount: 0,
    totalInterest: 0,
    totalAmount: 0,
    netDisbursed: 0,
  });

  const selectedBorrower = borrowers.find((b) => b.id === formData.borrowerId);
  const selectedLoanType = loanTypes.find((lt) => lt.id === formData.loanTypeId);
  const agents = staff.filter((s) => s.role === 'agent' && s.status === 'active');

  useEffect(() => {
    if (selectedLoanType && formData.principalAmount && formData.tenure) {
      const principal = Number(formData.principalAmount);
      const tenure = Number(formData.tenure);
      const rate = selectedLoanType.interestRate;
      const freq = selectedLoanType.repaymentFrequency;

      const emi = calculateEMI(principal, rate, tenure, freq);
      const total = emi * tenure;
      const interest = total - principal;
      const procFee = (principal * selectedLoanType.processingFee) / 100;
      const netDisbursed = principal - procFee;

      setCalculations({
        interestRate: rate,
        repaymentFrequency: freq,
        processingFee: procFee,
        emiAmount: Math.round(emi * 100) / 100,
        totalInterest: Math.round(interest * 100) / 100,
        totalAmount: Math.round(total * 100) / 100,
        netDisbursed: Math.round(netDisbursed * 100) / 100,
      });
    }
  }, [formData.loanTypeId, formData.principalAmount, formData.tenure, selectedLoanType, calculateEMI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.borrowerId || !formData.loanTypeId || !formData.principalAmount || !formData.tenure) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const disbursementDate = new Date(formData.disbursementDate);
    const startDate = new Date(disbursementDate);
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date(startDate);
    if (calculations.repaymentFrequency === 'daily') {
      endDate.setDate(endDate.getDate() + Number(formData.tenure));
    } else if (calculations.repaymentFrequency === 'weekly') {
      endDate.setDate(endDate.getDate() + Number(formData.tenure) * 7);
    } else {
      endDate.setMonth(endDate.getMonth() + Number(formData.tenure));
    }

    const selectedAgent = staff.find((s) => s.id === formData.assignedAgentId);

    addLoan({
      borrowerId: formData.borrowerId,
      borrowerName: selectedBorrower!.fullName,
      loanTypeId: formData.loanTypeId,
      loanTypeName: selectedLoanType!.name,
      principalAmount: Number(formData.principalAmount),
      interestRate: calculations.interestRate,
      tenure: Number(formData.tenure),
      repaymentFrequency: calculations.repaymentFrequency,
      processingFee: calculations.processingFee,
      netDisbursed: calculations.netDisbursed,
      disbursementDate,
      startDate,
      endDate,
      status: 'active',
      assignedAgentId: formData.assignedAgentId || undefined,
      assignedAgentName: selectedAgent?.fullName,
      createdBy: user?.id || '1',
    });

    toast({ title: 'Success', description: 'Loan created successfully' });
    navigate('/loans');
  };

  return (
    <div className="p-6">
      <PageHeader title="Create New Loan" description="Disburse a new loan to a borrower">
        <Button variant="outline" onClick={() => navigate('/loans')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Borrower *</Label>
                    <Select
                      value={formData.borrowerId}
                      onValueChange={(value) => setFormData({ ...formData, borrowerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select borrower" />
                      </SelectTrigger>
                      <SelectContent>
                        {borrowers.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.fullName} ({b.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Loan Type *</Label>
                    <Select
                      value={formData.loanTypeId}
                      onValueChange={(value) => setFormData({ ...formData, loanTypeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTypes.map((lt) => (
                          <SelectItem key={lt.id} value={lt.id}>
                            {lt.name} ({lt.interestRate}% - {lt.repaymentFrequency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Principal Amount (₹) *</Label>
                    <Input
                      type="number"
                      value={formData.principalAmount}
                      onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                      placeholder="Enter amount"
                    />
                    {selectedLoanType && (
                      <p className="text-xs text-muted-foreground">
                        Range: ₹{selectedLoanType.minAmount.toLocaleString()} - ₹{selectedLoanType.maxAmount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tenure *</Label>
                    <Input
                      type="number"
                      value={formData.tenure}
                      onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                      placeholder={`Number of ${calculations.repaymentFrequency === 'daily' ? 'days' : calculations.repaymentFrequency === 'weekly' ? 'weeks' : 'months'}`}
                    />
                    {selectedLoanType && (
                      <p className="text-xs text-muted-foreground">
                        Range: {selectedLoanType.minTenure} - {selectedLoanType.maxTenure}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Disbursement Date</Label>
                    <Input
                      type="date"
                      value={formData.disbursementDate}
                      onChange={(e) => setFormData({ ...formData, disbursementDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Assign Collection Agent</Label>
                    <Select
                      value={formData.assignedAgentId}
                      onValueChange={(value) => setFormData({ ...formData, assignedAgentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.fullName} ({agent.employeeCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedBorrower && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Borrower Information</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Phone:</span> {selectedBorrower.phone}</p>
                      <p><span className="text-muted-foreground">PAN:</span> {selectedBorrower.pan}</p>
                      <p className="col-span-2"><span className="text-muted-foreground">Address:</span> {selectedBorrower.address}, {selectedBorrower.city}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/loans')}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Create Loan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Calculations Panel */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Loan Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Principal Amount</span>
                <span className="font-medium">₹{Number(formData.principalAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-medium">{calculations.interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Repayment</span>
                <span className="font-medium capitalize">{calculations.repaymentFrequency}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">EMI Amount</span>
                <span className="font-bold text-primary">₹{calculations.emiAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-medium">₹{calculations.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">₹{calculations.processingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b bg-primary/5 -mx-4 px-4 rounded">
                <span className="text-muted-foreground">Net Disbursed</span>
                <span className="font-bold">₹{calculations.netDisbursed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 bg-success/10 -mx-4 px-4 rounded">
                <span className="font-medium">Total Repayable</span>
                <span className="font-bold text-lg">₹{calculations.totalAmount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
