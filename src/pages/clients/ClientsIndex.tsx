
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { getClients, deleteClient, Client } from '@/data/clients';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal,
  Plus,
  Trash,
  Edit,
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';

const ClientsIndex = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'growth'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "There was an error loading clients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clientToDeleteData = clientToDelete 
    ? clients.find(c => c.id === clientToDelete)
    : null;
  
  // Filter clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = 
        statusFilter === 'all' || 
        client.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      
      return sortOrder === 'asc'
        ? aNum - bNum
        : bNum - aNum;
    });
  
  // Handle sorting
  const handleSort = (field: 'name' | 'revenue' | 'growth') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Handle delete client
  const handleDeleteConfirm = async () => {
    if (clientToDelete === null) return;
    
    const clientName = clientToDeleteData?.name || 'Client';
    
    try {
      await deleteClient(clientToDelete);
      
      toast({
        title: "Client deleted",
        description: `${clientName} has been successfully removed.`,
      });
      
      // Remove the deleted client from the state
      setClients(prevClients => prevClients.filter(c => c.id !== clientToDelete));
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the client.",
        variant: "destructive"
      });
    } finally {
      setClientToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading clients...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
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
          
          <Button variant="default" onClick={() => navigate('/clients/add')}>
            <Plus size={16} className="mr-1" />
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
                  <td className="py-4 px-2 text-gray-600">${client.revenue ? client.revenue.toLocaleString() : 0}</td>
                  <td className="py-4 px-2">
                    <span className={client.growth && client.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {client.growth !== null ? (client.growth >= 0 ? '+' : '') + client.growth + '%' : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 pl-2 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                          <ExternalLink size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => setClientToDelete(client.id)}
                        >
                          <Trash size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={clientToDelete !== null} 
        onOpenChange={(open) => !open && setClientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client {clientToDeleteData?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ClientsIndex;
