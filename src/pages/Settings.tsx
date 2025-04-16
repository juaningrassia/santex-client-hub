import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [perplexityApiKey, setPerplexityApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  useEffect(() => {
    const savedPerplexityKey = localStorage.getItem('perplexityApiKey');
    const savedOpenAIKey = localStorage.getItem('openaiApiKey');
    
    console.log('Loading settings...');
    console.log('Perplexity API Key:', savedPerplexityKey ? 'Present' : 'Not found');
    
    if (savedPerplexityKey) setPerplexityApiKey(savedPerplexityKey);
    if (savedOpenAIKey) setOpenaiApiKey(savedOpenAIKey);
  }, []);
  
  const handlePerplexityKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerplexityApiKey(e.target.value);
    setSaveStatus('idle');
  };
  
  const handleOpenAIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenaiApiKey(e.target.value);
    setSaveStatus('idle');
  };
  
  const handleSave = () => {
    try {
      setSaveStatus('saving');
      console.log('Saving API keys...');
      
      if (perplexityApiKey) {
        localStorage.setItem('perplexityApiKey', perplexityApiKey);
        console.log('Perplexity API Key saved');
      }
      
      if (openaiApiKey) {
        localStorage.setItem('openaiApiKey', openaiApiKey);
      }
      
      setSaveStatus('saved');
      toast({
        title: "Settings saved",
        description: "API keys have been updated successfully"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      toast({
        title: "Error saving",
        description: "Could not save settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <div className="space-y-6">
          <div className="stats-card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">API Keys</h2>
            <p className="text-gray-600 mb-6">
              Configure your API keys to enable external data analysis and file processing.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="perplexity-api">Perplexity API Key</Label>
                <Input
                  id="perplexity-api"
                  type="password"
                  value={perplexityApiKey}
                  onChange={handlePerplexityKeyChange}
                  placeholder="Enter your Perplexity API key"
                />
                <p className="text-xs text-gray-500">
                  Used for external market analysis. Get your key at <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai/settings/api</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api">OpenAI API Key</Label>
                <Input
                  id="openai-api"
                  type="password"
                  value={openaiApiKey}
                  onChange={handleOpenAIKeyChange}
                  placeholder="Enter your OpenAI API key"
                />
                <p className="text-xs text-gray-500">
                  Used for internal document analysis.
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saveStatus === 'saving'}
                className="w-full"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  'Saved ✓'
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
