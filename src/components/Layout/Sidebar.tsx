
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  PieChart, 
  File, 
  BarChart4,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const menuItems = [
    { icon: LayoutDashboard, path: '/', label: 'Dashboard' },
    { icon: Users, path: '/clients', label: 'Clients' },
    { icon: PieChart, path: '/analytics', label: 'Analytics' },
    { icon: File, path: '/reports', label: 'Reports' },
    { icon: BarChart4, path: '/forecasts', label: 'Forecasts' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="h-screen w-16 flex flex-col bg-white border-r border-gray-200">
      <div className="p-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          CH
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-1 p-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              path === item.path ? "sidebar-icon-active" : "sidebar-icon",
              "flex items-center justify-center"
            )}
            title={item.label}
          >
            <item.icon size={20} />
          </Link>
        ))}
      </div>
      
      <div className="p-3">
        <button className="sidebar-icon flex items-center justify-center" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
