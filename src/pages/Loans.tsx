import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Eye, IndianRupee, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Loan } from '@/types';

export default function Loans() {
  const { loans } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.loanNumber.toLowerCase().includes(search.toLowerCase()) ||
      loan.borrowerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      closed: 'secondary',
      overdue: 'destructive',
      defaulted: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6">
      <PageHeader title="Loans" description="Manage all loan accounts">
        <Button onClick={() => navigate('/loans/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by loan number or borrower..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'closed', 'overdue'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        columns={[
          { key: 'loanNumber', header: 'Loan #' },
          { key: 'borrowerName', header: 'Borrower' },
          { key: 'loanTypeName', header: 'Type' },
          {
            key: 'principalAmount',
            header: 'Principal',
            render: (item) => `₹${item.principalAmount.toLocaleString()}`,
          },
          {
            key: 'emiAmount',
            header: 'EMI',
            render: (item) => `₹${item.emiAmount.toLocaleString()}`,
          },
          {
            key: 'remainingBalance',
            header: 'Balance',
            render: (item) => `₹${item.remainingBalance.toLocaleString()}`,
          },
          {
            key: 'repaymentFrequency',
            header: 'Frequency',
            render: (item) => <Badge variant="outline">{item.repaymentFrequency}</Badge>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (item) => getStatusBadge(item.status),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (item) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingLoan(item)}
                className="text-primary"
              >
                <Eye className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
      />

      {/* Loan Details Dialog */}
      <Dialog open={!!viewingLoan} onOpenChange={() => setViewingLoan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Loan Details - {viewingLoan?.loanNumber}
              {viewingLoan && getStatusBadge(viewingLoan.status)}
            </DialogTitle>
          </DialogHeader>
          {viewingLoan && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repayment Progress</span>
                  <span className="font-medium">
                    {((viewingLoan.totalPaid / viewingLoan.totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(viewingLoan.totalPaid / viewingLoan.totalAmount) * 100} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Paid: ₹{viewingLoan.totalPaid.toLocaleString()}</span>
                  <span>Total: ₹{viewingLoan.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-xs">Principal</span>
                    </div>
                    <p className="text-xl font-bold">₹{viewingLoan.principalAmount.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Interest</span>
                    </div>
                    <p className="text-xl font-bold">₹{viewingLoan.totalInterest.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">EMI Amount</span>
                    </div>
                    <p className="text-xl font-bold">₹{viewingLoan.emiAmount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Borrower</p>
                  <p className="font-medium">{viewingLoan.borrowerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Loan Type</p>
                  <p className="font-medium">{viewingLoan.loanTypeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">{viewingLoan.interestRate}% p.a.</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tenure</p>
                  <p className="font-medium">{viewingLoan.tenure} {viewingLoan.repaymentFrequency === 'daily' ? 'days' : viewingLoan.repaymentFrequency === 'weekly' ? 'weeks' : 'months'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Disbursement Date</p>
                  <p className="font-medium">{format(new Date(viewingLoan.disbursementDate), 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{format(new Date(viewingLoan.endDate), 'dd MMM yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Processing Fee</p>
                  <p className="font-medium">₹{viewingLoan.processingFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Net Disbursed</p>
                  <p className="font-medium">₹{viewingLoan.netDisbursed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Collection Agent</p>
                  <p className="font-medium">{viewingLoan.assignedAgentName || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining Balance</p>
                  <p className="font-medium text-destructive">₹{viewingLoan.remainingBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingLoan(null)}>
                  Close
                </Button>
                <Button onClick={() => navigate(`/collections/new?loanId=${viewingLoan.id}`)}>
                  Record Collection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
