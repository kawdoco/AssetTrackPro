import React, { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { TopBar } from './components/top-bar';
import { StatsCard } from './components/stats-card';
import { AssetMap } from './components/asset-map';
import { AlertsPanel } from './components/alerts-panel';
import { QuickActions } from './components/quick-actions';
import { ActionModal } from './components/modals';
import { AssetManagement } from './components/asset-management';
import { EmployeeManagement } from './components/EmployeeManagement';
import AlertsIncidents from './components/AlertsIncidents';

import { Package, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { OrganizationManagement } from './components/OrganizationManagement';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; type: 'asset' | 'employee' | 'event' }>({
    isOpen: false,
    title: '',
    type: 'asset'
  });

  const handleOpenModal = (type: 'asset' | 'employee' | 'event') => {
    const titles = {
      asset: 'Register New Asset',
      employee: 'Onboard Employee',
      event: 'Trigger Manual Event'
    };
    setModalConfig({
      isOpen: true,
      title: titles[type],
      type: type
    });
  };

  const renderContent = () => {
    if (activeTab === 'assets') {
      return <AssetManagement />;
    }
    if (activeTab === 'employees') {
      return <EmployeeManagement />;
    }
    if (activeTab === 'organizations') {
      return <OrganizationManagement />;
    }
    if (activeTab === 'alerts') {
      return <AlertsIncidents />;
    }

    return (
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Assets"
            value="14,292"
            subtext="Currently operational in all zones"
            trend="+12.5%"
            trendType="up"
            icon={Package}
            statusColor="#10B981"
            onClick={() => setActiveTab('assets')}
          />
          <StatsCard
            title="Assets in Transit"
            value="842"
            subtext="Moving between regional facilities"
            trend="-3.2%"
            trendType="down"
            icon={Truck}
            statusColor="#248AFF"
            onClick={() => {}}
          />
          <StatsCard
            title="Pending Alerts"
            value="06"
            subtext="Requires supervisor review"
            trend="2 Critical"
            trendType="down"
            icon={AlertCircle}
            statusColor="#F43F5E"
            onClick={() => {}}
          />
          <StatsCard
            title="Sync Status"
            value="99.9%"
            subtext="System latency: 2ms"
            trend="Stable"
            trendType="up"
            icon={RefreshCw}
            statusColor="#248AFF"
            onClick={() => {}}
          />
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
          <div className="lg:col-span-8">
            <AssetMap />
          </div>
          <div className="lg:col-span-4">
            <QuickActions onAction={handleOpenModal} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 h-[500px]">
            <AlertsPanel />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#395A8F]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 bg-gray-50/30 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <ActionModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        type={modalConfig.type}
      />
    </div>
  );
}
