
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, ArrowRight, TrendingUp, Newspaper, Link as LinkIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface ExternalAnalysisProps {
  client: Client;
}

interface AnalysisData {
  executiveSummary: string;
  risks: string[];
  opportunities: string[];
  recentNews: string[];
  sources: string[];
}

// Mock API response data para usar como respaldo
const mockAnalysisData = {
  executiveSummary: "Acme Corporation shows strong growth in the technology sector despite market challenges. Their focus on cloud services and AI solutions positions them well against competitors. Recent quarterly earnings exceeded analyst expectations by 12%.",
  risks: [
    "Increasing regulatory scrutiny in EU markets",
    "Rising competition from emerging startups",
    "Supply chain disruptions affecting hardware production",
    "Potential economic downturn affecting B2B sales"
  ],
  opportunities: [
    "Expansion into healthcare technology solutions",
    "Strategic acquisitions of AI startups",
    "Government contracts for cybersecurity services",
    "Growing demand for remote work infrastructure"
  ],
  recentNews: [
    "Acme announces new cloud security product line (2 days ago)",
    "CEO speaks at Tech Summit about AI ethics (1 week ago)",
    "Company opens new R&D center in Austin (2 weeks ago)",
    "Q3 earnings report exceeds expectations (1 month ago)"
  ],
  sources: [
    "Bloomberg Technology Report 2023",
    "Industry Analyst Quarterly Review",
    "Company Press Releases",
    "SEC Filings Q3 2023"
  ]
};

const ExternalAnalysis = ({ client }: ExternalAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState(client.name);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const handleSearch = async () => {
    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Needed",
        description: "Please enter your Perplexity API key to continue.",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const prompt = `
      Analyze the company ${searchTerm} and provide an executive summary, risks, opportunities, recent news, and verifiable sources. 
      Format your response in JSON with the following structure:
      {
        "executiveSummary": "Brief overview of the company's current position and outlook",
        "risks": ["Risk 1", "Risk 2", "Risk 3", "Risk 4"],
        "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3", "Opportunity 4"],
        "recentNews": ["News 1 (timestamp)", "News 2 (timestamp)", "News 3 (timestamp)", "News 4 (timestamp)"],
        "sources": ["Source 1", "Source 2", "Source 3", "Source 4"]
      }
      `;
      
      console.log("Sending request to Perplexity API with prompt:", prompt);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a business analyst assistant. Provide factual, well-structured analysis based on current business data and news. Format responses only in the requested JSON structure with no additional text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_domain_filter: ['perplexity.ai'],
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Response from Perplexity API:", data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        try {
          // Extraer el JSON de la respuesta
          const contentText = data.choices[0].message.content;
          const jsonMatch = contentText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : contentText;
          
          const parsedData = JSON.parse(jsonStr);
          console.log("Parsed response data:", parsedData);
          
          setAnalysisData(parsedData);
          toast({
            title: "Analysis Complete",
            description: "External analysis has been successfully retrieved.",
          });
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          // Fallback a mock data si hay error en formato JSON
          setAnalysisData(mockAnalysisData);
          toast({
            title: "Processing Error",
            description: "There was an error processing the API response. Using fallback data.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error calling Perplexity API:", error);
      // Fallback a mock data en caso de error en API
      setAnalysisData(mockAnalysisData);
      toast({
        title: "API Error",
        description: "Failed to connect to the Perplexity API. Using sample data instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="stats-card">
        <h3 className="card-header mb-4">External Market Analysis</h3>
        <p className="text-gray-600 mb-4">
          Enter a company name or industry to generate an AI-powered analysis using external data sources.
        </p>
        
        {showApiKeyInput && (
          <div className="mb-4">
            <div className="relative flex-1 mb-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Perplexity API key..."
                className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              You can get your Perplexity API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai/settings/api</a>
            </p>
          </div>
        )}
        
        <div className="flex gap-3 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Company or industry name..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !searchTerm.trim()} 
            className="flex items-center gap-2"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
            {!isLoading && <ArrowRight size={16} />}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Powered by Perplexity API. Results typically take 5-10 seconds.
        </p>
      </div>
      
      {isLoading && (
        <div className="stats-card flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Analyzing external data...</p>
          </div>
        </div>
      )}
      
      {analysisData && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <TrendingUp className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Executive Summary</h3>
            </div>
            <p className="text-gray-600">{analysisData.executiveSummary}</p>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="text-amber-500 mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Risks</h3>
            </div>
            <ul className="space-y-2">
              {analysisData.risks.map((risk, index) => (
                <li key={index} className="text-gray-600 flex gap-2">
                  <span className="text-red-500">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <TrendingUp className="text-green-500 mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Opportunities</h3>
            </div>
            <ul className="space-y-2">
              {analysisData.opportunities.map((opportunity, index) => (
                <li key={index} className="text-gray-600 flex gap-2">
                  <span className="text-green-500">•</span>
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <Newspaper className="text-gray-500 mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Recent News</h3>
            </div>
            <ul className="space-y-2">
              {analysisData.recentNews.map((news, index) => (
                <li key={index} className="text-gray-600 flex gap-2">
                  <span className="text-blue-500">•</span>
                  {news}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="stats-card md:col-span-2">
            <div className="flex items-start gap-2 mb-3">
              <LinkIcon className="text-gray-500 mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Verifiable Sources</h3>
            </div>
            <ul className="space-y-2">
              {analysisData.sources.map((source, index) => (
                <li key={index} className="text-gray-600 flex gap-2">
                  <span className="text-gray-400">•</span>
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalAnalysis;
