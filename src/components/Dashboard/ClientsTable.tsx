import React from 'react';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample client data
const clients = [
  { id: 1, name: 'Acme Corporation', status: 'Active', revenue: 125000, growth: 12.5 },
  { id: 2, name: 'Globex Industries', status: 'Active', revenue: 87500, growth: -2.3 },
  { id: 3, name: 'Soylent Corp', status: 'Inactive', revenue: 65000, growth: 5.7 },
  { id: 4, name: 'Initech LLC', status: 'Active', revenue: 32500, growth: 18.2 },
  { id: 5, name: 'Umbrella Corp', status: 'At Risk', revenue: 225000, growth: -8.5 },
];

const ClientsTable = () => {
  return (
    <div className="stats-card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="card-header">Top Clients</h3>
        <Link to="/clients" className="text-sm text-primary font-medium flex items-center gap-1">
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Revenue</th>
              <th className="pb-3 font-medium">Growth</th>
              <th className="pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">
                  <Link to={`/clients/${client.id}`} className="font-medium text-gray-800 hover:text-primary">
                    {client.name}
                  </Link>
                </td>
                <td className="py-3">
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
                <td className="py-3">${client.revenue.toLocaleString()}</td>
                <td className="py-3">
                  <span className={client.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {client.growth >= 0 ? '+' : ''}{client.growth}%
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
