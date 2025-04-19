
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/types/client';

export interface ExternalAnalysis {
  id: string;
  user_id: string;
  client_id: string;
  search_term: string;
  created_at: string;
  data: {
    executiveSummary: string[];
    companyRisks: Array<{ risk: string; explanation: string; }>;
    companyOpportunities: Array<{ opportunity: string; context: string; }>;
    industryRisks: Array<{ risk: string; explanation: string; }>;
    industryOpportunities: Array<{ opportunity: string; context: string; }>;
    sources: Array<{
      authors: string;
      title: string;
      source: string;
      url: string;
      credibility: string;
    }>;
  };
}

export async function saveAnalysis(clientId: string, searchTerm: string, analysisData: ExternalAnalysis['data']) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('external_analyses')
    .insert({
      client_id: clientId,
      user_id: userData.user.id,
      search_term: searchTerm,
      data: analysisData,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ExternalAnalysis;
}

export async function getClientAnalyses(clientId: string) {
  const { data, error } = await supabase
    .from('external_analyses')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ExternalAnalysis[];
}
