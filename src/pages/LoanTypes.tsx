import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { LoanType } from '@/types';

export default function LoanTypes() {
  const { loanTypes, addLoanType, updateLoanType, deleteLoanType } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoanType, setEditingLoanType] = useState<LoanType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    interestRate: '',
    minAmount: '',
    maxAmount: '',
    minTenure: '',
    maxTenure: '',
    repaymentFrequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    processingFee: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      interestRate: '',
      minAmount: '',
      maxAmount: '',
      minTenure: '',
      maxTenure: '',
      repaymentFrequency: 'monthly',
      processingFee: '',
    });
    setEditingLoanType(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (loanType: LoanType) => {
    setEditingLoanType(loanType);
    setFormData({
      name: loanType.name,
      description: loanType.description,
      interestRate: String(loanType.interestRate),
      minAmount: String(loanType.minAmount),
      maxAmount: String(loanType.maxAmount),
      minTenure: String(loanType.minTenure),
      maxTenure: String(loanType.maxTenure),
      repaymentFrequency: loanType.repaymentFrequency,
      processingFee: String(loanType.processingFee),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.interestRate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const data = {
      name: formData.name,
      description: formData.description,
      interestRate: Number(formData.interestRate),
      minAmount: Number(formData.minAmount),
      maxAmount: Number(formData.maxAmount),
      minTenure: Number(formData.minTenure),
      maxTenure: Number(formData.maxTenure),
      repaymentFrequency: formData.repaymentFrequency,
      processingFee: Number(formData.processingFee),
    };

    if (editingLoanType) {
      updateLoanType(editingLoanType.id, data);
      toast({ title: 'Success', description: 'Loan type updated successfully' });
    } else {
      addLoanType(data);
      toast({ title: 'Success', description: 'Loan type added successfully' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (loanType: LoanType) => {
    if (confirm(`Are you sure you want to delete "${loanType.name}"?`)) {
      deleteLoanType(loanType.id);
      toast({ title: 'Deleted', description: 'Loan type removed successfully' });
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'outline'> = {
      daily: 'default',
      weekly: 'secondary',
      monthly: 'outline',
    };
    return <Badge variant={colors[frequency]}>{frequency}</Badge>;
  };

  return (
    <div className="p-6">
      <PageHeader title="Loan Types" description="Configure different loan products">
        <Button onClick={openNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Loan Type
        </Button>
      </PageHeader>

      <DataTable
        data={loanTypes}
        keyExtractor={(item) => item.id}
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'interestRate',
            header: 'Interest Rate',
            render: (item) => `${item.interestRate}% p.a.`,
          },
          {
            key: 'amount',
            header: 'Amount Range',
            render: (item) =>
              `₹${item.minAmount.toLocaleString()} - ₹${item.maxAmount.toLocaleString()}`,
          },
          {
            key: 'tenure',
            header: 'Tenure Range',
            render: (item) => `${item.minTenure} - ${item.maxTenure}`,
          },
          {
            key: 'repaymentFrequency',
            header: 'Frequency',
            render: (item) => getFrequencyBadge(item.repaymentFrequency),
          },
          {
            key: 'processingFee',
            header: 'Processing Fee',
            render: (item) => `${item.processingFee}%`,
          },
          {
            key: 'createdAt',
            header: 'Created',
            render: (item) => format(new Date(item.createdAt), 'dd/MM/yyyy'),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (item) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(item)}
                  className="text-primary hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLoanType ? 'Edit Loan Type' : 'Add New Loan Type'}</DialogTitle>
            <DialogDescription>Configure the loan product parameters</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Loan Type Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Business Loan"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this loan type"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% p.a.) *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="e.g., 18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={formData.processingFee}
                  onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                  placeholder="e.g., 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min Amount (₹)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Max Amount (₹)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  placeholder="e.g., 500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minTenure">Min Tenure</Label>
                <Input
                  id="minTenure"
                  type="number"
                  value={formData.minTenure}
                  onChange={(e) => setFormData({ ...formData, minTenure: e.target.value })}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTenure">Max Tenure</Label>
                <Input
                  id="maxTenure"
                  type="number"
                  value={formData.maxTenure}
                  onChange={(e) => setFormData({ ...formData, maxTenure: e.target.value })}
                  placeholder="e.g., 24"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Repayment Frequency</Label>
                <Select
                  value={formData.repaymentFrequency}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                    setFormData({ ...formData, repaymentFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingLoanType ? 'Update' : 'Add'} Loan Type</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
