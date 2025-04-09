
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [perplexityApiKey, setPerplexityApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved settings on init
  useEffect(() => {
    const savedPerplexityKey = localStorage.getItem('perplexityApiKey');
    const savedOpenaiKey = localStorage.getItem('openaiApiKey');
    
    if (savedPerplexityKey) setPerplexityApiKey(savedPerplexityKey);
    if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
  }, []);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Save settings to localStorage
    localStorage.setItem('perplexityApiKey', perplexityApiKey);
    localStorage.setItem('openaiApiKey', openaiApiKey);
    
    // Simulate brief saving time
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your API keys have been updated.",
      });
      setIsSaving(false);
    }, 500);
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
                  onChange={(e) => setPerplexityApiKey(e.target.value)}
                  placeholder="Enter your Perplexity API key"
                />
                <p className="text-xs text-gray-500">
                  Used for external market analysis and company insights. Get it from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai/settings/api</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api">OpenAI API Key</Label>
                <Input
                  id="openai-api"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
                <p className="text-xs text-gray-500">
                  Used for internal document analysis and strategic insights. Required for analyzing client documents in the Internal Analysis section.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
