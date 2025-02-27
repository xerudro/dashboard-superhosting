import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import HostingServices from '../components/dashboard/services/HostingServices';
import DatabaseServices from '../components/dashboard/services/DatabaseServices';
import DomainServices from '../components/dashboard/services/DomainServices';
import EmailServices from '../components/dashboard/services/EmailServices';
import SSLServices from '../components/dashboard/services/SSLServices';
import CurrencyServices from '../components/dashboard/services/CurrencyServices';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/hosting" element={<HostingServices />} />
        <Route path="/databases" element={<DatabaseServices />} />
        <Route path="/domains" element={<DomainServices />} />
        <Route path="/email" element={<EmailServices />} />
        <Route path="/ssl" element={<SSLServices />} />
        <Route path="/currency" element={<CurrencyServices />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;