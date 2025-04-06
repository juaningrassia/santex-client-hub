
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className
}: StatCardProps) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="card-label">{title}</h3>
          <p className="card-value">{value}</p>
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {change && (
        <div className={cn(
          "text-sm mt-2 flex items-center",
          changeType === 'positive' && "text-green-600",
          changeType === 'negative' && "text-red-600",
          changeType === 'neutral' && "text-gray-500"
        )}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
