
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import ClientForm from './ClientForm';
import { addClient } from '@/data/clients';
import { toast } from '@/components/ui/use-toast';

const AddClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSaveClient = (clientData: any) => {
    setIsLoading(true);
    
    // Simular un pequeño delay para la experiencia de usuario
    setTimeout(() => {
      try {
        // Añadir el cliente
        const newClient = addClient(clientData);
        
        toast({
          title: "Client created",
          description: `${newClient.name} has been successfully added.`,
        });
        
        // Redirigir a la página de detalles del cliente
        navigate(`/clients/${newClient.id}`);
      } catch (error) {
        console.error("Error adding client:", error);
        toast({
          title: "Error",
          description: "There was an error adding the client. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };
  
  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add New Client</h1>
      </div>
      
      <div className="stats-card">
        <ClientForm onSave={handleSaveClient} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default AddClient;
