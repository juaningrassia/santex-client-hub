
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [perplexityApiKey, setPerplexityApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [language, setLanguage] = useState('english');
  const [isSaving, setIsSaving] = useState(false);
  
  // Cargar configuraciones guardadas al iniciar
  useEffect(() => {
    const savedPerplexityKey = localStorage.getItem('perplexityApiKey');
    const savedOpenaiKey = localStorage.getItem('openaiApiKey');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedPerplexityKey) setPerplexityApiKey(savedPerplexityKey);
    if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Guardar configuraciones en localStorage
    localStorage.setItem('perplexityApiKey', perplexityApiKey);
    localStorage.setItem('openaiApiKey', openaiApiKey);
    localStorage.setItem('language', language);
    
    // Simular un breve tiempo de guardado
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your API keys and preferences have been updated.",
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
                  Used for internal document analysis and strategic recommendations. This key will be used when analyzing documents in the client details page.
                </p>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Interface Language</Label>
                <RadioGroup value={language} onValueChange={setLanguage}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spanish" id="spanish" />
                    <Label htmlFor="spanish">Spanish</Label>
                  </div>
                </RadioGroup>
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
