import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Receipt,
  UserCog,
  FileText,
  ChevronDown,
  ChevronLeft,
  LogOut,
  Building2,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, collapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
        'hover:bg-sidebar-accent text-sidebar-foreground',
        isActive && 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary-foreground')} />
      {!collapsed && (
        <span className={cn('text-sm font-medium transition-opacity', isActive && 'text-sidebar-primary-foreground')}>
          {label}
        </span>
      )}
    </NavLink>
  );
};

interface NavGroupProps {
  label: string;
  icon: React.ElementType;
  items: { to: string; label: string }[];
  collapsed: boolean;
}

const NavGroup = ({ label, icon: Icon, items, collapsed }: NavGroupProps) => {
  const location = useLocation();
  const isAnyActive = items.some((item) => location.pathname === item.to);
  const [isOpen, setIsOpen] = useState(isAnyActive);

  if (collapsed) {
    return (
      <div className="relative group">
        <button
          className={cn(
            'flex items-center justify-center w-full px-2 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-sidebar-accent text-sidebar-foreground',
            isAnyActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
          <div className="bg-sidebar rounded-lg shadow-lg border border-sidebar-border p-2 min-w-[160px]">
            <p className="text-xs font-semibold text-sidebar-foreground/70 px-2 pb-2">{label}</p>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'block px-3 py-2 rounded-md text-sm transition-colors',
                  'hover:bg-sidebar-accent text-sidebar-foreground',
                  location.pathname === item.to && 'bg-sidebar-primary text-sidebar-primary-foreground'
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200',
          'hover:bg-sidebar-accent text-sidebar-foreground',
          isAnyActive && 'bg-sidebar-accent'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-48 mt-1' : 'max-h-0'
        )}
      >
        <div className="pl-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                'hover:bg-sidebar-accent text-sidebar-foreground/80',
                location.pathname === item.to &&
                  'bg-sidebar-primary text-sidebar-primary-foreground'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <aside
      className={cn(
        'h-screen gradient-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center gap-3 p-4 border-b border-sidebar-border', collapsed && 'justify-center')}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
          M
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-sidebar-foreground">MicroFinance</h1>
            <p className="text-xs text-sidebar-foreground/60">Loan Management</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground shadow-md"
      >
        {collapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem to="/dashboard" icon={LayoutDashboard} label={t('nav.dashboard')} collapsed={collapsed} />

        <NavGroup
          label={t('nav.borrowers')}
          icon={Building2}
          collapsed={collapsed}
          items={[
            { to: '/borrowers', label: t('nav.borrowers') },
            { to: '/loan-types', label: t('nav.loanTypes') },
          ]}
        />

        <NavGroup
          label={t('nav.loans')}
          icon={Wallet}
          collapsed={collapsed}
          items={[
            { to: '/loans', label: t('nav.loans') },
            { to: '/loans/new', label: t('loans.createNew') },
            { to: '/collections', label: t('nav.collections') },
            { to: '/collections/new', label: t('collections.recordNew') },
          ]}
        />

        <NavItem to="/staff" icon={UserCog} label={t('nav.staff')} collapsed={collapsed} />
        <NavItem to="/reports" icon={FileText} label={t('nav.reports')} collapsed={collapsed} />
      </nav>

      {/* User Section */}
      <div className={cn('p-3 border-t border-sidebar-border', collapsed && 'px-2')}>
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50',
            collapsed && 'justify-center'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className={cn(
              'text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10',
              collapsed && 'p-1'
            )}
            title={t('nav.logout')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
