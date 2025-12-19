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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Borrower } from '@/types';

export default function Borrowers() {
  const { borrowers, addBorrower, updateBorrower, deleteBorrower } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [viewingBorrower, setViewingBorrower] = useState<Borrower | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    govtId: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const filteredBorrowers = borrowers.filter(
    (b) =>
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.code.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      fullName: '',
      displayName: '',
      gender: 'male',
      phone: '',
      email: '',
      govtId: '',
      pan: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
    });
    setEditingBorrower(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (borrower: Borrower) => {
    setEditingBorrower(borrower);
    setFormData({
      fullName: borrower.fullName,
      displayName: borrower.displayName,
      gender: borrower.gender,
      phone: borrower.phone,
      email: borrower.email || '',
      govtId: borrower.govtId,
      pan: borrower.pan,
      address: borrower.address,
      city: borrower.city,
      state: borrower.state,
      pinCode: borrower.pinCode,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.govtId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingBorrower) {
      updateBorrower(editingBorrower.id, formData);
      toast({ title: 'Success', description: 'Borrower updated successfully' });
    } else {
      addBorrower({ ...formData, createdBy: '1' });
      toast({ title: 'Success', description: 'Borrower added successfully' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (borrower: Borrower) => {
    if (confirm(`Are you sure you want to delete ${borrower.fullName}?`)) {
      deleteBorrower(borrower.id);
      toast({ title: 'Deleted', description: 'Borrower removed successfully' });
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Borrowers" description="Manage your borrower database">
        <Button onClick={openNewDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Borrower
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredBorrowers}
        keyExtractor={(item) => item.id}
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'fullName', header: 'Full Name' },
          { key: 'phone', header: 'Phone' },
          { key: 'pan', header: 'PAN' },
          { key: 'city', header: 'City' },
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
                  onClick={() => {
                    setViewingBorrower(item);
                    setIsViewDialogOpen(true);
                  }}
                  className="text-info hover:text-info"
                >
                  <Eye className="h-4 w-4" />
                </Button>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBorrower ? 'Edit Borrower' : 'Add New Borrower'}</DialogTitle>
            <DialogDescription>
              {editingBorrower ? 'Update borrower information' : 'Enter the borrower details below'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Short name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female' | 'other') =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other / Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="govtId">Govt ID (Aadhaar) *</Label>
                <Input
                  id="govtId"
                  value={formData.govtId}
                  onChange={(e) => setFormData({ ...formData, govtId: e.target.value })}
                  placeholder="XXXX-XXXX-XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="AAAAA0000A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="6-digit PIN"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingBorrower ? 'Update' : 'Add'} Borrower</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Borrower Details</DialogTitle>
          </DialogHeader>
          {viewingBorrower && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {viewingBorrower.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{viewingBorrower.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{viewingBorrower.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewingBorrower.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{viewingBorrower.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Govt ID</p>
                  <p className="font-medium">{viewingBorrower.govtId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">PAN</p>
                  <p className="font-medium">{viewingBorrower.pan || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {viewingBorrower.address}, {viewingBorrower.city}, {viewingBorrower.state} - {viewingBorrower.pinCode}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created On</p>
                  <p className="font-medium">{format(new Date(viewingBorrower.createdAt), 'dd MMM yyyy')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
