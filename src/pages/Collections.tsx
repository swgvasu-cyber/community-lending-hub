import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Collections() {
  const { collections } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredCollections = collections.filter(
    (c) =>
      c.collectionNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      c.loanNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader title="Collections" description="Track all loan repayments">
        <Button onClick={() => navigate('/collections/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collections..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <DataTable
        data={filteredCollections}
        keyExtractor={(item) => item.id}
        columns={[
          { key: 'collectionNumber', header: 'Collection #' },
          { key: 'loanNumber', header: 'Loan #' },
          { key: 'borrowerName', header: 'Borrower' },
          { key: 'borrowerPhone', header: 'Phone' },
          { key: 'collectionDate', header: 'Date', render: (item) => format(new Date(item.collectionDate), 'dd/MM/yyyy') },
          { key: 'expectedAmount', header: 'Expected', render: (item) => `₹${item.expectedAmount.toLocaleString()}` },
          { key: 'collectedAmount', header: 'Collected', render: (item) => `₹${item.collectedAmount.toLocaleString()}` },
          { key: 'paymentMode', header: 'Mode', render: (item) => <Badge variant="outline">{item.paymentMode}</Badge> },
          { key: 'agentName', header: 'Agent' },
        ]}
      />
    </div>
  );
}
