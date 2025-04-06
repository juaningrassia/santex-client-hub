
import React, { useState } from 'react';
import { 
  Download, 
  ChevronDown, 
  Bell, 
  Search,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const Header = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  
  const dateRanges = [
    'Today',
    'Yesterday',
    'Last 7 days',
    'Last 30 days',
    'This month',
    'Last month',
    'Custom range',
  ];

  return (
    <header className="w-full h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-gray-600 flex items-center gap-2">
              {dateRange}
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              {dateRanges.map((range) => (
                <div 
                  key={range}
                  className="px-2 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => setDateRange(range)}
                >
                  {range}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="default" className="flex items-center gap-2">
          <Download size={16} />
          Export
        </Button>
        
        <Button variant="ghost" className="text-gray-600" size="icon">
          <Bell size={18} />
        </Button>
        
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
