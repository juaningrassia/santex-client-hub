
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const path = location.pathname;
  
  const menuItems = [{
    icon: Users,
    path: '/clients',
    label: 'Clients'
  }, {
    icon: Settings,
    path: '/settings',
    label: 'Settings'
  }];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div className="h-screen w-16 flex flex-col bg-white border-r border-gray-200">
      <TooltipProvider>
        <div className="p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-emerald-900 cursor-default">
                {user?.email.substring(0, 2).toUpperCase()}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user?.email}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex-1 flex flex-col gap-1 p-2">
          {menuItems.map(item => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    path === item.path ? "sidebar-icon-active" : "sidebar-icon",
                    "flex items-center justify-center"
                  )}
                >
                  <item.icon size={20} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <div className="p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="sidebar-icon flex items-center justify-center"
              >
                <LogOut size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;
