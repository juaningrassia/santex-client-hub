
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
        title: "Configuración guardada",
        description: "Tus API keys y preferencias han sido actualizadas.",
      });
      setIsSaving(false);
    }, 500);
  };
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h1>
        
        <div className="space-y-6">
          <div className="stats-card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">API Keys</h2>
            <p className="text-gray-600 mb-6">
              Configura tus API keys para habilitar el análisis de datos externos y el procesamiento de archivos.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="perplexity-api">Perplexity API Key</Label>
                <Input
                  id="perplexity-api"
                  type="password"
                  value={perplexityApiKey}
                  onChange={(e) => setPerplexityApiKey(e.target.value)}
                  placeholder="Introduce tu API key de Perplexity"
                />
                <p className="text-xs text-gray-500">
                  Usada para análisis de mercado externo e información de empresas. Obtenla en <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai/settings/api</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api">OpenAI API Key</Label>
                <Input
                  id="openai-api"
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Introduce tu API key de OpenAI"
                />
                <p className="text-xs text-gray-500">
                  Usada para el análisis de documentos internos en la sección de Análisis Interno de cada cliente. 
                  Permite procesar archivos CSV, TXT y PDF para obtener insights estratégicos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferencias</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Idioma de la Interfaz</Label>
                <RadioGroup value={language} onValueChange={setLanguage}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english">Inglés</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spanish" id="spanish" />
                    <Label htmlFor="spanish">Español</Label>
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
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
