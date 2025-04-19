import React, { useState, useEffect } from 'react';
import type { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, ArrowRight, TrendingUp, Newspaper, Link as LinkIcon, AlertCircle, LineChart, Loader2, RefreshCw, Download, History } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToPDF } from '@/utils/pdfExport';
import { saveAnalysis, getClientAnalyses, type ExternalAnalysis } from '@/services/analysisService';

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

const mockAnalysisData: AnalysisData = {
  // Mock API response data for fallback
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
  const [previousAnalyses, setPreviousAnalyses] = useState<ExternalAnalysis[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingPrevious, setLoadingPrevious] = useState(true);
  
  useEffect(() => {
    const loadPreviousAnalyses = async () => {
      try {
        const analyses = await getClientAnalyses(client.id);
        setPreviousAnalyses(analyses);
      } catch (error) {
        console.error('Error loading previous analyses:', error);
        toast({
          title: "Error",
          description: "Could not load previous analyses",
          variant: "destructive"
        });
      } finally {
        setLoadingPrevious(false);
      }
    };
    
    loadPreviousAnalyses();
  }, [client.id]);
  
  useEffect(() => {
    const savedApiKey = localStorage.getItem('perplexityApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const handleSearch = async () => {
    if (!apiKey) {
      toast({
        title: "Perplexity API key not found",
        description: <div>Please add it in the <Link to="/settings" className="underline">Settings</Link> page.</div>,
        variant: "destructive"
      });
      return;
    }

    if (!apiKey.match(/^pplx-[a-zA-Z0-9]{32,}$/)) {
      toast({
        title: "Invalid API key",
        description: "The format of the Perplexity API key is invalid. It must start with 'pplx-' followed by at least 32 alphanumeric characters.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = `
      You are an expert business intelligence analyst specialized in producing strategic analysis reports with current market data.

      IMPORTANT TEMPORAL CONSTRAINTS:
      - Focus ONLY on information and developments from the last 6 months
      - Prioritize the most recent data available (last 3 months when possible)
      - Explicitly mention dates in citations when available
      - Discard any information older than 6 months unless it's a critical historical context

      RESEARCH FOCUS FOR ${searchTerm}:
      1. Recent market developments and strategic changes
      2. Latest financial performance and market position
      3. Current competitive landscape
      4. Emerging trends affecting the company
      5. Recent regulatory changes or compliance requirements
      6. Latest technological adoptions or digital initiatives
      7. Most recent sustainability and ESG initiatives
      8. Current market challenges and opportunities

      REQUIRED SOURCE CRITERIA:
      - Only include sources from the last 6 months
      - Prioritize official company reports, reputable financial news, and industry analyses
      - Include specific dates for all citations
      - Verify information across multiple current sources when possible

      OUTPUT REQUIREMENTS:
      You MUST respond with properly formatted JSON that follows this exact structure:
      {
        "executiveSummary": [
          "Recent Development 1 (with date if applicable)",
          "Recent Development 2 (with date if applicable)",
          "Recent Development 3 (with date if applicable)",
          "Recent Development 4 (with date if applicable)",
          "Recent Development 5 (with date if applicable)"
        ],
        "companyRisks": [
          {
            "risk": "Current Risk 1",
            "explanation": "Recent context and impact with citation [1]"
          },
          {
            "risk": "Current Risk 2",
            "explanation": "Recent context and impact with citation [2]"
          },
          {
            "risk": "Current Risk 3",
            "explanation": "Recent context and impact with citation [3]"
          }
        ],
        "companyOpportunities": [
          {
            "opportunity": "Current Opportunity 1",
            "context": "Recent market context with citation [4]"
          },
          {
            "opportunity": "Current Opportunity 2",
            "context": "Recent market context with citation [5]"
          },
          {
            "opportunity": "Current Opportunity 3",
            "context": "Recent market context with citation [6]"
          }
        ],
        "industryRisks": [
          {
            "risk": "Current Industry Risk 1",
            "explanation": "Recent industry context with citation [7]"
          },
          {
            "risk": "Current Industry Risk 2",
            "explanation": "Recent industry context with citation [8]"
          },
          {
            "risk": "Current Industry Risk 3",
            "explanation": "Recent industry context with citation [9]"
          }
        ],
        "industryOpportunities": [
          {
            "opportunity": "Current Industry Opportunity 1",
            "context": "Recent industry context with citation [10]"
          },
          {
            "opportunity": "Current Industry Opportunity 2",
            "context": "Recent industry context with citation [11]"
          },
          {
            "opportunity": "Current Industry Opportunity 3",
            "context": "Recent industry context with citation [12]"
          }
        ],
        "sources": [
          {
            "authors": "Author(s) name and publication date (within last 6 months)",
            "title": "Article or report title",
            "source": "Publication name or platform",
            "url": "Direct URL to source",
            "credibility": "Brief note on source credibility and recency",
            "publicationDate": "Specific publication date (YYYY-MM-DD format)"
          }
        ]
      }

      IMPORTANT RESPONSE GUIDELINES:
      1. Include ONLY information from the last 6 months
      2. Include specific dates whenever possible
      3. Prioritize quantitative data and specific metrics
      4. Ensure all citations reference recent sources
      5. Focus on actionable insights and current market dynamics
      6. Your response must be valid, parseable JSON with no additional text or formatting
      7. No markdown, no explanations outside the JSON, just the JSON object

      Remember to maintain strict JSON formatting and include only the most current and relevant information from the past 6 months.
      `;
      
      console.log("Sending request to Perplexity API...");
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are an expert business intelligence analyst. You MUST respond with properly formatted JSON only. No markdown formatting, no text outside the JSON object.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Perplexity API error:", errorData);
        
        let errorMessage = "Unknown error connecting to Perplexity API.";
        
        if (response.status === 401) {
          errorMessage = "The provided API key is invalid or has expired.";
        } else if (response.status === 429) {
          errorMessage = "API request limit exceeded. Please try again later.";
        } else if (response.status === 500) {
          errorMessage = "Internal server error from Perplexity. Please try again later.";
        } else if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "API Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        if (response.status >= 500) {
          setAnalysisData(mockAnalysisData);
        }
        return;
      }
      
      const data = await response.json();
      console.log("Perplexity API response:", data);
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid API response format");
      }
      
      try {
        let parsedData = JSON.parse(data.choices[0].message.content);
        
        await saveAnalysis(client.id, searchTerm, parsedData);
        
        setAnalysisData(parsedData);
        const updatedAnalyses = await getClientAnalyses(client.id);
        setPreviousAnalyses(updatedAnalyses);
        
        toast({
          title: "Analysis Completed",
          description: "Strategic analysis has been generated and saved successfully.",
        });
      } catch (parseError) {
        console.error("Error processing response:", parseError);
        setError("Error processing API response. The response does not have the expected format.");
        toast({
          title: "Processing Error",
          description: "The API response does not have the expected format. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
      setError("Error connecting to Perplexity API. Please check your connection and try again.");
      toast({
        title: "Connection Error",
        description: "Could not establish connection with Perplexity API. Check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadPreviousAnalysis = (analysis: ExternalAnalysis) => {
    setAnalysisData(analysis.data);
    setSearchTerm(analysis.search_term);
    toast({
      title: "Previous Analysis Loaded",
      description: `Loaded analysis from ${new Date(analysis.created_at).toLocaleDateString()}`,
    });
  };
  
  const handleExportPDF = async () => {
    if (!analysisData) {
      toast({
        title: "No hay datos para exportar",
        description: "You must first generate an analysis to export it.",
        variant: "destructive"
      });
      return;
    }

    try {
      await exportToPDF(
        'external-analysis-content',
        `analisis_externo_${client.name.toLowerCase().replace(/\s+/g, '_')}`,
        `External Analysis - ${client.name}`
      );
      
      toast({
        title: "Export successful",
        description: "The analysis has been exported to PDF successfully.",
      });
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      toast({
        title: "Error al exportar",
        description: "Hubo un problema al generar el PDF. Por favor, intenta nuevamente.",
        variant: "destructive"
      });
    }
  };
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Strategic Business Analysis</CardTitle>
              <CardDescription className="text-base">
                Enter a company name to generate a detailed strategic analysis with evidence-based information.
              </CardDescription>
            </div>
            {analysisData && (
              <Button 
                onClick={handleExportPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export to PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!apiKey && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertTriangle size={16} />
                Perplexity API key not found. Please add it in the <Link to="/settings" className="font-medium underline">Settings</Link> page.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Company name..."
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchTerm.trim() || !apiKey} 
              className="flex items-center gap-2 px-6 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Powered by Perplexity API. Strategic analysis usually takes between 10 and 15 seconds.
          </p>
        </CardContent>
      </Card>
      
      {isLoading && renderLoadingSkeleton()}
      
      {analysisData && !isLoading && (
        <div id="external-analysis-content" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                <CardTitle className="text-xl">Executive Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisData.executiveSummary.map((point, index) => (
                  <li key={index} className="text-gray-700 flex gap-3 items-start">
                    <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20">
                      {index + 1}
                    </Badge>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-amber-500" size={20} />
                  <CardTitle className="text-xl">Company Risks</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {analysisData.companyRisks.map((item, index) => (
                    <div key={index} className="pb-4 last:pb-0">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1 bg-amber-50 text-amber-700 border-amber-200">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-800">{item.risk}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.explanation}</p>
                        </div>
                      </div>
                      {index < analysisData.companyRisks.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-500" size={20} />
                  <CardTitle className="text-xl">Company Opportunities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {analysisData.companyOpportunities.map((item, index) => (
                    <div key={index} className="pb-4 last:pb-0">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-800">{item.opportunity}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.context}</p>
                        </div>
                      </div>
                      {index < analysisData.companyOpportunities.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <CardTitle className="text-xl">Industry Risks</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {analysisData.industryRisks.map((item, index) => (
                    <div key={index} className="pb-4 last:pb-0">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1 bg-red-50 text-red-700 border-red-200">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-800">{item.risk}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.explanation}</p>
                        </div>
                      </div>
                      {index < analysisData.industryRisks.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <LineChart className="text-blue-500" size={20} />
                  <CardTitle className="text-xl">Industry Opportunities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {analysisData.industryOpportunities.map((item, index) => (
                    <div key={index} className="pb-4 last:pb-0">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-800">{item.opportunity}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.context}</p>
                        </div>
                      </div>
                      {index < analysisData.industryOpportunities.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="text-gray-500" size={20} />
                <CardTitle className="text-xl">Sources and Evidence</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.sources.map((source, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 bg-gray-200 text-gray-700 border-gray-300">
                        [{index + 1}]
                      </Badge>
                      <div>
                        <p className="font-medium text-gray-800">{source.authors}</p>
                        <p className="text-gray-700 italic mt-1">"{source.title}"</p>
                        <p className="text-gray-600 mt-1">{source.source}</p>
                        <p className="text-gray-500 text-xs mt-2">{source.credibility}</p>
                        {source.url && (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary text-sm mt-2 inline-flex items-center gap-1 hover:underline"
                          >
                            View source
                            <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleSearch} 
              disabled={isLoading || !searchTerm.trim() || !apiKey}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Update Analysis
            </Button>
          </div>
        </div>
      )}
      
      {!isLoading && previousAnalyses.length > 0 && !analysisData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-primary" size={20} />
              Previous Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previousAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{analysis.search_term}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => loadPreviousAnalysis(analysis)}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight size={16} />
                    View Analysis
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExternalAnalysis;
