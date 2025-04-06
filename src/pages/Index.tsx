
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import StatCard from '@/components/Dashboard/StatCard';
import RevenueChart from '@/components/Dashboard/RevenueChart';
import ClientsTable from '@/components/Dashboard/ClientsTable';
import { Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value="$1,254,300" 
          change="+14.2% from last month" 
          changeType="positive"
          icon={<DollarSign size={20} />}
        />
        <StatCard 
          title="Active Clients" 
          value="48" 
          change="+2 new this month" 
          changeType="positive" 
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Avg. Client Value" 
          value="$26,131" 
          change="+5.3% from last month" 
          changeType="positive"
          icon={<TrendingUp size={20} />}
        />
        <StatCard 
          title="At-Risk Clients" 
          value="7" 
          change="+2 from last month" 
          changeType="negative"
          icon={<AlertTriangle size={20} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart className="lg:col-span-2" />
        
        <div className="stats-card">
          <h3 className="card-header">Client Breakdown</h3>
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Pie chart placeholder</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ClientsTable />
      </div>
    </MainLayout>
  );
};

export default Index;
