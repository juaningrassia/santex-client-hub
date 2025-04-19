
import { supabase } from '@/integrations/supabase/client';
import type { Client, NewClient } from '@/types/client';

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as Client[];
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as Client;
}

export async function createClient(client: Omit<NewClient, 'user_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) throw userError;
  if (!userData.user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...client,
      user_id: userData.user.id,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as Client;
}

export async function updateClient(id: string, client: Partial<Omit<NewClient, 'user_id'>>) {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
}
