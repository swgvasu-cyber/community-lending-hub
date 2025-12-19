import React from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, IndianRupee, TrendingUp, PieChart } from 'lucide-react';

export default function Reports() {
  const { getStats, loans, borrowers, collections } = useData();
  const stats = getStats();

  const reports = [
    { title: 'Borrower Summary', desc: `${borrowers.length} total borrowers registered`, icon: Users, value: borrowers.length },
    { title: 'Loan Portfolio', desc: `${loans.length} loans, ${stats.activeLoans} active`, icon: CreditCard, value: `₹${(stats.totalDisbursed/100000).toFixed(1)}L` },
    { title: 'Collection Report', desc: `${collections.length} collections recorded`, icon: IndianRupee, value: `₹${(stats.totalCollected/100000).toFixed(1)}L` },
    { title: 'Collection Rate', desc: 'Overall repayment performance', icon: TrendingUp, value: `${stats.collectionRate.toFixed(1)}%` },
    { title: 'Outstanding Report', desc: 'Pending dues across all loans', icon: PieChart, value: `${stats.pendingInstallments} EMIs` },
    { title: 'Agent Performance', desc: 'Collection by agents', icon: FileText, value: '10 agents' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Reports" description="View business analytics and reports" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, idx) => (
          <Card key={idx} className="hover-lift cursor-pointer transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">{report.title}</CardTitle>
              <report.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary mb-1">{report.value}</p>
              <p className="text-sm text-muted-foreground">{report.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
