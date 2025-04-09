
import React, { useState, useEffect } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, ArrowRight, TrendingUp, Newspaper, Link as LinkIcon, AlertCircle, LineChart } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';

interface ExternalAnalysisProps {
  client: Client;
}

interface AnalysisData {
  executiveSummary: string[];
  companyRisks: Array<{
    risk: string;
    explanation: string;
  }>;
  companyOpportunities: Array<{
    opportunity: string;
    context: string;
  }>;
  industryRisks: Array<{
    risk: string;
    explanation: string;
  }>;
  industryOpportunities: Array<{
    opportunity: string;
    context: string;
  }>;
  sources: Array<{
    authors: string;
    title: string;
    source: string;
    url: string;
    credibility: string;
  }>;
}

// Mock API response data for fallback
const mockAnalysisData: AnalysisData = {
  executiveSummary: [
    "Strong market position in fast-food industry with multiple established brands",
    "Digital transformation initiatives showing positive results in sales growth",
    "International expansion creating new revenue streams",
    "Facing increasing competition and changing consumer preferences",
    "Supply chain challenges impacting operational efficiency"
  ],
  companyRisks: [
    {
      risk: "Increasing competition from health-focused alternatives",
      explanation: "Health-conscious consumers are shifting away from traditional fast food, impacting sales growth [1]"
    },
    {
      risk: "Rising commodity and labor costs",
      explanation: "Inflation is increasing operational expenses, putting pressure on profit margins [2]"
    },
    {
      risk: "Franchisee relationship challenges",
      explanation: "Tensions with franchisees over operational changes and investment requirements [3]"
    }
  ],
  companyOpportunities: [
    {
      opportunity: "Digital ordering and delivery expansion",
      context: "Further development of mobile apps and third-party delivery partnerships could increase sales [4]"
    },
    {
      opportunity: "Plant-based menu innovations",
      context: "Expanding plant-based offerings to capture growing vegetarian and flexitarian market segments [5]"
    },
    {
      opportunity: "Strategic acquisitions",
      context: "Potential to acquire complementary brands to diversify portfolio and access new markets [6]"
    }
  ],
  industryRisks: [
    {
      risk: "Changing consumer preferences",
      explanation: "Shift towards healthier eating habits challenging traditional fast-food models [7]"
    },
    {
      risk: "Labor shortages",
      explanation: "Difficulty attracting and retaining workers in the food service industry [8]"
    },
    {
      risk: "Regulatory pressures",
      explanation: "Increasing regulations on ingredients, labeling, and environmental practices [9]"
    }
  ],
  industryOpportunities: [
    {
      opportunity: "Technology integration",
      context: "AI and automation can improve efficiency and customer experience [10]"
    },
    {
      opportunity: "Sustainable practices",
      context: "Eco-friendly packaging and responsible sourcing can attract environmentally conscious consumers [11]"
    },
    {
      opportunity: "Ghost kitchens",
      context: "Delivery-only locations can reduce costs while expanding service areas [12]"
    }
  ],
  sources: [
    {
      authors: "McKinsey & Company (2024)",
      title: "The future of fast food: Navigating disruption",
      source: "McKinsey Insights",
      url: "https://www.mckinsey.com/insights",
      credibility: "Leading global management consulting firm"
    },
    {
      authors: "Restaurant Business Magazine (2024)",
      title: "Annual industry report: Challenges and trends",
      source: "Restaurant Business Online",
      url: "https://www.restaurantbusinessonline.com",
      credibility: "Industry-specific publication with expert analysis"
    },
    {
      authors: "National Restaurant Association (2024)",
      title: "State of the Restaurant Industry",
      source: "National Restaurant Association",
      url: "https://restaurant.org/research",
      credibility: "Major industry association research division"
    }
  ]
};

const ExternalAnalysis = ({ client }: ExternalAnalysisProps) => {
  const [searchTerm, setSearchTerm] = useState(client.name);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  // Load API key from localStorage on init
  useEffect(() => {
    const savedApiKey = localStorage.getItem('perplexityApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const handleSearch = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: <div>Please add your Perplexity API key in <Link to="/settings" className="underline">Settings</Link></div>,
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const prompt = `
      #CONTEXT: Adopt the role of a strategic business researcher. Your task is to analyze a specific company and its industry in depth, identifying key risks and growth opportunities based on current market dynamics, competitive environment, and technological trends.

      #ROLE: You are an expert in business intelligence and market research. Your objective is to generate a concise, evidence-based briefing that highlights business-critical insights for strategic decision-making.

      #INSTRUCTIONS: Conduct deep research on ${searchTerm} and its industry, focusing on:

      Company-Level Analysis
      - What are the main risks currently facing the company?
      - What opportunities for growth are available to the company?
      - Include recent events, financial performance, leadership decisions, regulatory issues, or market disruptions.

      Industry-Level Analysis
      - What are the primary risks affecting the industry as a whole?
      - What are the key growth trends or opportunities in the industry?
      - Consider economic shifts, innovation patterns, regulatory developments, and competitive dynamics.

      #RESPONSE FORMAT: Format your response in JSON with the following structure:
      {
        "executiveSummary": ["Insight 1", "Insight 2", "Insight 3", "Insight 4", "Insight 5"],
        "companyRisks": [
          {"risk": "Risk 1", "explanation": "Explanation with citation [1]"},
          {"risk": "Risk 2", "explanation": "Explanation with citation [2]"},
          {"risk": "Risk 3", "explanation": "Explanation with citation [3]"}
        ],
        "companyOpportunities": [
          {"opportunity": "Opportunity 1", "context": "Context with citation [4]"},
          {"opportunity": "Opportunity 2", "context": "Context with citation [5]"},
          {"opportunity": "Opportunity 3", "context": "Context with citation [6]"}
        ],
        "industryRisks": [
          {"risk": "Risk 1", "explanation": "Explanation with citation [7]"},
          {"risk": "Risk 2", "explanation": "Explanation with citation [8]"},
          {"risk": "Risk 3", "explanation": "Explanation with citation [9]"}
        ],
        "industryOpportunities": [
          {"opportunity": "Opportunity 1", "context": "Context with citation [10]"},
          {"opportunity": "Opportunity 2", "context": "Context with citation [11]"},
          {"opportunity": "Opportunity 3", "context": "Context with citation [12]"}
        ],
        "sources": [
          {
            "authors": "Author(s) and date",
            "title": "Title",
            "source": "Source/platform",
            "url": "URL",
            "credibility": "Brief credibility note"
          }
        ]
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
              content: 'You are an expert business intelligence analyst. Provide detailed, evidence-based analysis using the specified JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2000,
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
          // Extract JSON from response
          const contentText = data.choices[0].message.content;
          const jsonMatch = contentText.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : contentText;
          
          const parsedData = JSON.parse(jsonStr);
          console.log("Parsed response data:", parsedData);
          
          setAnalysisData(parsedData);
          toast({
            title: "Analysis Complete",
            description: "Strategic business analysis has been successfully retrieved.",
          });
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          // Fallback to mock data on JSON parsing error
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
      // Fallback to mock data on API error
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
        <h3 className="card-header mb-4">Strategic Business Analysis</h3>
        <p className="text-gray-600 mb-4">
          Enter a company name to generate an in-depth strategic analysis with evidence-based insights.
        </p>
        
        {!apiKey && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <AlertTriangle size={16} />
              Perplexity API key not found. Please add it in the <Link to="/settings" className="font-medium underline">Settings</Link> page.
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
              placeholder="Company name..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !searchTerm.trim() || !apiKey} 
            className="flex items-center gap-2"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
            {!isLoading && <ArrowRight size={16} />}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Powered by Perplexity API. Strategic analysis typically takes 10-15 seconds.
        </p>
      </div>
      
      {isLoading && (
        <div className="stats-card flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Analyzing business data...</p>
          </div>
        </div>
      )}
      
      {analysisData && !isLoading && (
        <div className="space-y-4">
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <TrendingUp className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Executive Summary</h3>
            </div>
            <ul className="space-y-2">
              {analysisData.executiveSummary.map((point, index) => (
                <li key={index} className="text-gray-600 flex gap-2">
                  <span className="text-primary">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="stats-card">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="text-amber-500 mt-1" size={18} />
                <h3 className="font-medium text-gray-800">Company Risks</h3>
              </div>
              <div className="space-y-4">
                {analysisData.companyRisks.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-700">{item.risk}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="stats-card">
              <div className="flex items-start gap-2 mb-3">
                <TrendingUp className="text-green-500 mt-1" size={18} />
                <h3 className="font-medium text-gray-800">Company Opportunities</h3>
              </div>
              <div className="space-y-4">
                {analysisData.companyOpportunities.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-700">{item.opportunity}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="stats-card">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="text-red-500 mt-1" size={18} />
                <h3 className="font-medium text-gray-800">Industry Risks</h3>
              </div>
              <div className="space-y-4">
                {analysisData.industryRisks.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-700">{item.risk}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="stats-card">
              <div className="flex items-start gap-2 mb-3">
                <LineChart className="text-blue-500 mt-1" size={18} />
                <h3 className="font-medium text-gray-800">Industry Opportunities</h3>
              </div>
              <div className="space-y-4">
                {analysisData.industryOpportunities.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-700">{item.opportunity}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.context}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <LinkIcon className="text-gray-500 mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Sources & Evidence</h3>
            </div>
            <div className="space-y-3">
              {analysisData.sources.map((source, index) => (
                <div key={index} className="text-sm border-l-2 border-gray-200 pl-3">
                  <p className="font-medium text-gray-700">[{index + 1}] {source.authors}</p>
                  <p className="text-gray-600 italic">"{source.title}"</p>
                  <p className="text-gray-600">{source.source}</p>
                  <p className="text-gray-500 text-xs mt-1">{source.credibility}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalAnalysis;
