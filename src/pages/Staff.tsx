import React from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export default function Staff() {
  const { staff } = useData();
  const staffMembers = staff.filter((s) => s.role === 'staff');
  const agents = staff.filter((s) => s.role === 'agent');

  return (
    <div className="p-6">
      <PageHeader title="Staff & Agents" description="Manage your team members" />

      <Tabs defaultValue="staff">
        <TabsList className="mb-6">
          <TabsTrigger value="staff">Staff ({staffMembers.length})</TabsTrigger>
          <TabsTrigger value="agents">Collection Agents ({agents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <DataTable
            data={staffMembers}
            keyExtractor={(item) => item.id}
            columns={[
              { key: 'employeeCode', header: 'Code' },
              { key: 'fullName', header: 'Name' },
              { key: 'phone', header: 'Phone' },
              { key: 'email', header: 'Email' },
              { key: 'address', header: 'Location' },
              { key: 'joiningDate', header: 'Joined', render: (item) => format(new Date(item.joiningDate), 'dd/MM/yyyy') },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>{item.status}</Badge> },
            ]}
          />
        </TabsContent>

        <TabsContent value="agents">
          <DataTable
            data={agents}
            keyExtractor={(item) => item.id}
            columns={[
              { key: 'employeeCode', header: 'Code' },
              { key: 'fullName', header: 'Name' },
              { key: 'phone', header: 'Phone' },
              { key: 'address', header: 'Location' },
              { key: 'assignedLoansCount', header: 'Assigned Loans', render: (item) => item.assignedLoansCount || 0 },
              { key: 'totalCollected', header: 'Total Collected', render: (item) => `₹${(item.totalCollected || 0).toLocaleString()}` },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>{item.status}</Badge> },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
