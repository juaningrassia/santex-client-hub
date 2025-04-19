
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import ClientForm from './ClientForm';
import { Client, getClientById, updateClient } from '@/data/clients';
import { toast } from '@/components/ui/use-toast';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClient, setIsLoadingClient] = useState(true);
  const navigate = useNavigate();
  
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
          navigate('/clients');
        } finally {
          setIsLoadingClient(false);
        }
      };
      
      fetchClient();
    }
  }, [id, navigate]);
  
  const handleUpdateClient = async (clientData: Omit<Client, 'id'>) => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      // Update the client
      const updatedClient = await updateClient(id, clientData);
      
      toast({
        title: "Client updated",
        description: `${updatedClient.name} has been successfully updated.`,
      });
      
      // Redirect to the client details page
      navigate(`/clients/${updatedClient.id}`);
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "There was an error updating the client. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoadingClient) {
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/clients')}
            className="text-primary hover:underline"
          >
            Return to Clients
          </button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Client: {client.name}</h1>
      </div>
      
      <div className="stats-card">
        <ClientForm 
          client={client} 
          onSave={handleUpdateClient} 
          isLoading={isLoading} 
        />
      </div>
    </MainLayout>
  );
};

export default EditClient;
