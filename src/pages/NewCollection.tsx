import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';

export default function NewCollection() {
  const { loans, staff, addCollection } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preselectedLoanId = searchParams.get('loanId');

  const activeLoans = loans.filter((l) => l.status === 'active');
  const agents = staff.filter((s) => s.role === 'agent');

  const [formData, setFormData] = useState({
    loanId: preselectedLoanId || '',
    collectionDate: new Date().toISOString().split('T')[0],
    collectedAmount: '',
    paymentMode: 'cash' as 'cash' | 'upi' | 'bank_transfer' | 'cheque',
    agentId: '',
    remarks: '',
  });

  const selectedLoan = loans.find((l) => l.id === formData.loanId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loanId || !formData.collectedAmount || !formData.agentId) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    const loan = loans.find((l) => l.id === formData.loanId)!;
    const agent = staff.find((s) => s.id === formData.agentId)!;
    const collected = Number(formData.collectedAmount);

    addCollection({
      loanId: loan.id,
      loanNumber: loan.loanNumber,
      borrowerId: loan.borrowerId,
      borrowerName: loan.borrowerName,
      borrowerPhone: '9876543214',
      collectionDate: new Date(formData.collectionDate),
      payDate: new Date(formData.collectionDate),
      installmentNumber: Math.ceil((loan.totalPaid + collected) / loan.emiAmount),
      expectedAmount: loan.emiAmount,
      collectedAmount: collected,
      balanceAmount: loan.emiAmount - collected,
      paymentMode: formData.paymentMode,
      agentId: agent.id,
      agentName: agent.fullName,
      remarks: formData.remarks,
    });

    toast({ title: 'Success', description: 'Collection recorded successfully' });
    navigate('/collections');
  };

  return (
    <div className="p-6">
      <PageHeader title="Record Collection" description="Record a new loan repayment">
        <Button variant="outline" onClick={() => navigate('/collections')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
      </PageHeader>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Collection Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Loan *</Label>
                <Select value={formData.loanId} onValueChange={(v) => setFormData({ ...formData, loanId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select loan" /></SelectTrigger>
                  <SelectContent>
                    {activeLoans.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.loanNumber} - {l.borrowerName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Collection Date</Label>
                <Input type="date" value={formData.collectionDate} onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Amount Collected (₹) *</Label>
                <Input type="number" value={formData.collectedAmount} onChange={(e) => setFormData({ ...formData, collectedAmount: e.target.value })} placeholder={selectedLoan ? `EMI: ₹${selectedLoan.emiAmount}` : 'Enter amount'} />
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={formData.paymentMode} onValueChange={(v: any) => setFormData({ ...formData, paymentMode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Collection Agent *</Label>
                <Select value={formData.agentId} onValueChange={(v) => setFormData({ ...formData, agentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedLoan && (
              <div className="p-4 bg-muted rounded-lg text-sm">
                <p><strong>Loan:</strong> {selectedLoan.loanNumber} | <strong>EMI:</strong> ₹{selectedLoan.emiAmount} | <strong>Balance:</strong> ₹{selectedLoan.remainingBalance.toLocaleString()}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/collections')}>Cancel</Button>
              <Button type="submit"><Save className="h-4 w-4 mr-2" />Save Collection</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
