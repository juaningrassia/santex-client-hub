
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { clients } from '@/data/clients';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const ClientsIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'growth'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter and sort clients
  const filteredClients = clients
    .filter((client) => {
      // Filter by search term
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || client.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'revenue') {
        return sortOrder === 'asc' 
          ? a.revenue - b.revenue
          : b.revenue - a.revenue;
      } else {
        return sortOrder === 'asc' 
          ? a.growth - b.growth
          : b.growth - a.growth;
      }
    });
  
  // Handle sort
  const handleSort = (column: 'name' | 'revenue' | 'growth') => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Clients</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                {statusFilter === 'all' ? 'All Statuses' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('at risk')}>
                At Risk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default">
            Add Client
          </Button>
        </div>
      </div>
      
      <div className="stats-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th 
                  className="pb-3 pl-4 pr-2 font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="pb-3 px-2 font-medium">Industry</th>
                <th className="pb-3 px-2 font-medium">Status</th>
                <th 
                  className="pb-3 px-2 font-medium cursor-pointer"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center gap-1">
                    Revenue
                    {sortBy === 'revenue' && (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="pb-3 px-2 font-medium cursor-pointer"
                  onClick={() => handleSort('growth')}
                >
                  <div className="flex items-center gap-1">
                    Growth
                    {sortBy === 'growth' && (
                      sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="pb-3 px-2 font-medium">Contact</th>
                <th className="pb-3 pl-2 pr-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 pl-4 pr-2">
                    <Link to={`/clients/${client.id}`} className="font-medium text-gray-800 hover:text-primary">
                      {client.name}
                    </Link>
                  </td>
                  <td className="py-4 px-2 text-gray-600">{client.industry}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : client.status === 'At Risk'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600">${client.revenue.toLocaleString()}</td>
                  <td className="py-4 px-2">
                    <span className={client.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {client.growth >= 0 ? '+' : ''}{client.growth}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600">{client.contactName}</td>
                  <td className="py-4 pl-2 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link to={`/clients/${client.id}`} className="w-full">View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No clients found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientsIndex;
