
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { getClientById, Client } from '@/data/clients';
import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import ExternalAnalysis from './analysis/ExternalAnalysis';
import InternalAnalysis from './analysis/InternalAnalysis';
import { toast } from '@/components/ui/use-toast';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const fetchedClient = await getClientById(id);
          setClient(fetchedClient);
        } catch (error) {
          console.error("Error fetching client:", error);
          toast({
            title: "Client not found",
            description: "The requested client could not be found.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchClient();
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Loading client data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!client) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Client not found</h2>
          <p className="text-gray-600 mb-6">The client you're looking for doesn't exist or has been removed.</p>
          <Link to="/clients">
            <Button>Return to Clients</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/clients" className="text-gray-600 flex items-center gap-1 mb-4 hover:text-gray-900">
          <ArrowLeft size={16} />
          Back to Clients
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{client.name}</h1>
            <p className="text-gray-500">{client.industry}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm rounded-full ${
              client.status === 'Active' 
                ? 'bg-green-100 text-green-700' 
                : client.status === 'At Risk'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {client.status}
            </span>
            
            <Link to={`/clients/${client.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="stats-card lg:col-span-1">
          <h3 className="card-header mb-4">Client Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <Building size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Company Address</p>
                <p className="text-gray-800">{client.address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{client.contact_email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{client.contact_phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Client Since</p>
                <p className="text-gray-800">{client.start_date ? new Date(client.start_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-gray-400 mt-0.5">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-800">{client.notes}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="external" className="space-y-4">
            <TabsList>
              <TabsTrigger value="external">External Analysis</TabsTrigger>
              <TabsTrigger value="internal">Internal Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="external">
              <ExternalAnalysis client={client} />
            </TabsContent>
            <TabsContent value="internal">
              <InternalAnalysis client={client} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDetail;
