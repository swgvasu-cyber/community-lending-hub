import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { DataTable } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  Receipt,
  AlertTriangle,
  IndianRupee,
  CalendarCheck,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { getStats, loans, collections } = useData();
  const { t } = useLanguage();
  const stats = getStats();

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toFixed(0)}`;
  };

  const recentLoans = loans.slice(0, 5);
  const recentCollections = collections.slice(-5).reverse();

  return (
    <div className="p-6">
      <PageHeader
        title={t('dashboard.title')}
        description={t('dashboard.welcome')}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t('dashboard.totalBorrowers')}
          value={stats.totalBorrowers}
          icon={Users}
          variant="primary"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title={t('dashboard.activeLoans')}
          value={stats.activeLoans}
          icon={CreditCard}
          variant="accent"
        />
        <StatCard
          title={t('dashboard.totalDisbursed')}
          value={formatCurrency(stats.totalDisbursed)}
          icon={Wallet}
          variant="success"
        />
        <StatCard
          title={t('dashboard.totalCollected')}
          value={formatCurrency(stats.totalCollected)}
          icon={IndianRupee}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t('dashboard.todayCollection')}
          value={formatCurrency(stats.todayCollection)}
          icon={CalendarCheck}
          variant="success"
        />
        <StatCard
          title={t('dashboard.collectionRate')}
          value={`${stats.collectionRate.toFixed(1)}%`}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          title={t('dashboard.pendingEMIs')}
          value={stats.pendingInstallments}
          icon={Receipt}
          variant="warning"
        />
        <StatCard
          title={t('dashboard.overdueAmount')}
          value={formatCurrency(stats.overdueAmount)}
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {t('dashboard.recentLoans')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentLoans}
              keyExtractor={(item) => item.id}
              columns={[
                { key: 'loanNumber', header: t('dashboard.loanNumber') },
                { key: 'borrowerName', header: t('dashboard.borrower') },
                {
                  key: 'principalAmount',
                  header: t('dashboard.amount'),
                  render: (item) => `₹${item.principalAmount.toLocaleString()}`,
                },
                {
                  key: 'status',
                  header: t('dashboard.status'),
                  render: (item) => (
                    <Badge
                      variant={item.status === 'active' ? 'default' : item.status === 'closed' ? 'secondary' : 'destructive'}
                    >
                      {item.status}
                    </Badge>
                  ),
                },
              ]}
              pageSize={5}
              emptyMessage={t('dashboard.noLoans')}
            />
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-success" />
              {t('dashboard.recentCollections')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={recentCollections}
              keyExtractor={(item) => item.id}
              columns={[
                { key: 'collectionNumber', header: t('dashboard.collectionNumber') },
                { key: 'borrowerName', header: t('dashboard.borrower') },
                {
                  key: 'collectedAmount',
                  header: t('dashboard.amount'),
                  render: (item) => `₹${item.collectedAmount.toLocaleString()}`,
                },
                {
                  key: 'collectionDate',
                  header: t('dashboard.date'),
                  render: (item) => format(new Date(item.collectionDate), 'dd/MM/yyyy'),
                },
              ]}
              pageSize={5}
              emptyMessage={t('dashboard.noCollections')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
