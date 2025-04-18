import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle, AlertCircle, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, LineChart, Download, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { exportToPDF } from '@/utils/pdfExport';

interface InternalAnalysisProps {
  client: Client;
}

// Define the structure for analysis data
interface AnalysisData {
  executiveSummary: string;
  riskScore: {
    overall: number;
    companyRisk: number;
    industryRisk: number;
    trend: 'up' | 'down' | 'stable';
  };
  companyRisks: Array<{
    risk: string;
    severity: 'high' | 'medium' | 'low';
    explanation: string;
  }>;
  companyOpportunities: Array<{
    opportunity: string;
    potential: 'high' | 'medium' | 'low';
    context: string;
  }>;
  industryRisks: Array<{
    risk: string;
    severity: 'high' | 'medium' | 'low';
    explanation: string;
  }>;
  industryOpportunities: Array<{
    opportunity: string;
    potential: 'high' | 'medium' | 'low';
    context: string;
  }>;
  strategicQuestions: string[];
}

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required")
});

const InternalAnalysis = ({
  client
}: InternalAnalysisProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [fileContents, setFileContents] = useState<string[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: localStorage.getItem('openaiApiKey') || ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files selected",
        description: `${newFiles.length} file(s) ready for analysis`
      });
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      if (file.type === "application/pdf") {
        resolve("PDF content extraction would happen here. This is a placeholder text.");
      } else {
        reader.readAsText(file);
      }
    });
  };

  const readFilesContent = async (files: File[]): Promise<string[]> => {
    const contents: string[] = [];
    
    for (const file of files) {
      try {
        const content = await readFileContent(file);
        contents.push(content);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        throw error;
      }
    }
    
    return contents;
  };

  const analyzeWithOpenAI = async (content: string, apiKey: string): Promise<AnalysisData> => {
    try {
      const prompt = `You are a senior B2B Account Manager with deep experience in customer strategy, sales, and business consulting.

You will receive multiple internal client documents in plain text format, separated by "--- New Document ---". These documents may include both CSV files and text documents. Your job is to analyze ALL these documents collectively and generate a comprehensive analysis.

⚠️ Very important:
- CRUCIAL: Process and analyze ALL documents, especially CSV files
- For CSV files: Parse the data structure and extract meaningful insights
- For text files: Extract qualitative information and context
- Cross-reference and combine information from ALL documents
- If you detect a CSV format, treat it as structured data and analyze its columns and values
- Your analysis MUST reflect information from ALL provided documents
- Your tone should be professional, insightful, and focused on business value

---

🧠 Part 1: Executive Summary  
Write a comprehensive and actionable summary based on ALL provided documents. Use short paragraphs or bullet points.

Include:
- General description of the client and current situation (from ALL documents)
- Quantitative data analysis from CSV files (if present)
- Business goals and metrics (from ALL sources)
- Products/services information (from ALL documents)
- Problems or risks (from ALL sources)
- Opportunities for growth (from ALL sources)
- Final recommendations based on complete analysis

---

❓ Part 2: Strategic Analysis
Based on ALL documents provided:

1. Data Analysis (if CSV present):
   - Key metrics and trends from CSV data
   - Statistical insights and patterns
   - Correlation with information from text documents

2. Risk Assessment:
   - Quantitative risks (from CSV data)
   - Qualitative risks (from text documents)
   - Combined risk analysis from all sources

3. Opportunity Analysis:
   - Data-driven opportunities (from CSV)
   - Strategic opportunities (from text)
   - Combined opportunity assessment

4. Strategic Questions (EXACTLY 10 required):
   YOU MUST GENERATE EXACTLY 10 QUESTIONS, including:
   - Questions based on CSV data analysis
   - Questions about trends and patterns
   - Questions about potential contradictions
   - Questions about unexplored areas
   - Questions about strategic alignment

---

Here are the internal client documents:

${content}

Please format your response as a valid JSON object with the following structure:
{
  "executiveSummary": "Your comprehensive executive summary here...",
  "riskScore": {
    "overall": 65,
    "companyRisk": 70,
    "industryRisk": 60,
    "trend": "up"
  },
  "companyRisks": [
    {
      "risk": "Risk identified from documents (including CSV data)",
      "severity": "high|medium|low",
      "explanation": "Explanation with reference to specific documents and data points"
    }
  ],
  "companyOpportunities": [
    {
      "opportunity": "Opportunity identified across documents (including CSV insights)",
      "potential": "high|medium|low",
      "context": "Context with reference to specific documents and data"
    }
  ],
  "industryRisks": [
    {
      "risk": "Industry risk identified",
      "severity": "high|medium|low",
      "explanation": "Explanation with cross-document references"
    }
  ],
  "industryOpportunities": [
    {
      "opportunity": "Industry opportunity identified",
      "potential": "high|medium|low",
      "context": "Context with cross-document references"
    }
  ],
  "strategicQuestions": [
    "Question 1 based on CSV data analysis",
    "Question 2 about quantitative trends",
    "Question 3 about qualitative insights",
    "Question 4 about risk mitigation",
    "Question 5 about growth opportunities",
    "Question 6 about market positioning",
    "Question 7 about operational efficiency",
    "Question 8 about strategic alignment",
    "Question 9 about competitive advantage",
    "Question 10 about future scalability"
  ]
}

CRITICAL REQUIREMENTS:
1. You MUST generate EXACTLY 10 strategic questions
2. You MUST analyze ALL documents, especially CSV files
3. You MUST incorporate CSV data analysis in all sections
4. You MUST maintain proper JSON formatting
5. You MUST reference specific data points from CSV files in your analysis`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are a helpful assistant that analyzes client data and provides business insights."
          }, {
            role: "user",
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: {
            type: "json_object"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error communicating with OpenAI');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return {
        executiveSummary: result.executiveSummary,
        riskScore: result.riskScore,
        companyRisks: result.companyRisks,
        companyOpportunities: result.companyOpportunities,
        industryRisks: result.industryRisks,
        industryOpportunities: result.industryOpportunities,
        strategicQuestions: result.strategicQuestions
      };
    } catch (error) {
      console.error('Error analyzing with OpenAI:', error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to analyze",
        variant: "destructive"
      });
      return;
    }

    const apiKey = localStorage.getItem('openaiApiKey');
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const contents = await readFilesContent(files);
      setFileContents(contents);
      const combinedContent = contents.join('\n\n--- New Document ---\n\n');
      const analysis = await analyzeWithOpenAI(combinedContent, apiKey);
      setAnalysisData(analysis);
      toast({
        title: "Analysis complete",
        description: "Documents have been successfully analyzed"
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitApiKey = async (values: z.infer<typeof formSchema>) => {
    localStorage.setItem('openaiApiKey', values.apiKey);
    setShowApiKeyDialog(false);
    handleAnalyze();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast({
        title: "Files selected",
        description: `${newFiles.length} file(s) ready for analysis`
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {/* Risk Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="text-center">
                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-1/3 mx-auto mt-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      {/* Risks and Opportunities */}
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

      {/* Strategic Questions */}
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
        'internal-analysis-content',
        `analisis_interno_${client.name.toLowerCase().replace(/\s+/g, '_')}`,
        `Internal Analysis - ${client.name}`
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

  return (
    <div className="space-y-4">
      <div className="stats-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-header">Internal Data Analysis</h3>
          {analysisData && (
            <Button 
              onClick={handleExportPDF}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Export PDF
            </Button>
          )}
        </div>
        <p className="text-gray-600 mb-4">
          Upload internal data (CSV or TXT) to generate strategic insights and questions for client meetings.
        </p>
        
        <div className="flex flex-col gap-3 mb-4">
          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors relative" 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className="text-gray-400 mb-2" size={28} />
              <p className="text-gray-600 mb-2">
                {files.length > 0 
                  ? `${files.length} file(s) selected` 
                  : 'Drag and drop files, or click to browse'}
              </p>
              <p className="text-xs text-gray-500">
                Supports CSV and TXT up to 10MB per file
              </p>
              
              <label className="mt-2 cursor-pointer">
                <span className="text-sm text-primary">Browse files</span>
                <input 
                  type="file" 
                  accept=".csv,.txt" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected files:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                    <span className="truncate flex-1 mr-4">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Button onClick={handleAnalyze} disabled={isLoading || files.length === 0} className="w-full">
            {isLoading ? 'Analyzing...' : 'Analyze Documents'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 flex items-start gap-1">
          <HelpCircle size={14} />
          <span>Powered by OpenAI API. Internal analysis typically takes 10-15 seconds.</span>
        </div>
      </div>
      
      {isLoading && renderLoadingSkeleton()}
      
      {analysisData && !isLoading && (
        <div id="internal-analysis-content" className="space-y-6">
          {/* Risk Score Widget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Overall Risk Score</h4>
                  <div className={`text-4xl font-bold ${getRiskScoreColor(analysisData.riskScore.overall)}`}>
                    {analysisData.riskScore.overall}%
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    {analysisData.riskScore.trend === 'up' ? (
                      <ArrowUpRight className="text-red-500" size={16} />
                    ) : analysisData.riskScore.trend === 'down' ? (
                      <ArrowDownRight className="text-green-500" size={16} />
                    ) : (
                      <span className="text-yellow-500">→</span>
                    )}
                    <span className="text-sm text-gray-500 ml-1">Trend</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Company Risk</h4>
                  <div className={`text-4xl font-bold ${getRiskScoreColor(analysisData.riskScore.companyRisk)}`}>
                    {analysisData.riskScore.companyRisk}%
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Industry Risk</h4>
                  <div className={`text-4xl font-bold ${getRiskScoreColor(analysisData.riskScore.industryRisk)}`}>
                    {analysisData.riskScore.industryRisk}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Executive Summary */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="text-primary" size={20} />
                <CardTitle className="text-xl">Executive Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600 whitespace-pre-line">{analysisData.executiveSummary}</div>
            </CardContent>
          </Card>

          {/* Risks and Opportunities */}
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
                        <Badge variant="outline" className={`mt-1 bg-amber-50 text-amber-700 border-amber-200`}>
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
                        <Badge variant="outline" className={`mt-1 bg-green-50 text-green-700 border-green-200`}>
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
                        <Badge variant="outline" className={`mt-1 bg-red-50 text-red-700 border-red-200`}>
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
                        <Badge variant="outline" className={`mt-1 bg-blue-50 text-blue-700 border-blue-200`}>
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

          {/* Strategic Questions */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-primary" size={20} />
                <CardTitle className="text-xl">Strategic Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 list-decimal list-inside">
                {analysisData.strategicQuestions.map((question, index) => (
                  <li key={index} className="text-gray-600">{question}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key Required</DialogTitle>
            <DialogDescription>
              To analyze documents, you need to provide your OpenAI API key.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitApiKey)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="sk-..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Continue with analysis</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternalAnalysis;
