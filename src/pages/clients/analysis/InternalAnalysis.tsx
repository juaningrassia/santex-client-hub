
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InternalAnalysisProps {
  client: Client;
}

// This will be replaced with actual document processing
const processDocumentContent = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Return the file content as string
        resolve(e.target.result as string);
      } else {
        resolve("No content could be extracted from the file.");
      }
    };
    reader.readAsText(file);
  });
};

// Chat prompt for document analysis
const generateAnalysisPrompt = (clientName: string, fileContent: string) => {
  return `
You are a senior B2B Account Manager with expertise in customer strategy and business development.

Your task is to analyze the following internal client information and generate two outputs. Only use the data provided. Do not invent or assume any information that is not explicitly included in the input. If any required element is missing, say so.

---

🔹 Part 1: Executive Summary  
Create a concise and actionable summary of the client based **only on the content provided**.

Include:
- General description of the client and their current situation (if available)
- Business goals (if mentioned or implied)
- Products/services purchased and their status
- Problems or risks explicitly stated
- Opportunities mentioned or deduced logically
- Recommendations based on available facts only

⚠️ Do not make assumptions. If any item is missing in the input, state it clearly (e.g., "No business goals were mentioned").

---

🔹 Part 2: 10 Strategic Questions  
Generate 10 thoughtful, specific questions that an Account Manager could ask the client. These questions must:

- Be based strictly on the data provided
- Help uncover risks, needs, or opportunities mentioned in the input
- Encourage deeper business conversations
- Be consultative, not generic

⚠️ Do not include any question unless it is clearly inspired by content in the input.

---

Here is the internal client information for ${clientName}:

${fileContent}

Respond in JSON format with the following structure:
{
  "executiveSummary": "Your executive summary here",
  "strategicQuestions": [
    "Question 1",
    "Question 2",
    ...
  ]
}
`;
};

// Simulate API call to get analysis
const analyzeDocument = async (clientName: string, fileContent: string): Promise<any> => {
  // In a real implementation, this would call an API endpoint
  console.log(`Analyzing document for ${clientName}...`);
  console.log(`Document content: ${fileContent.substring(0, 200)}...`);
  
  // Get API key from settings
  const openaiApiKey = localStorage.getItem('openaiApiKey');
  if (!openaiApiKey) {
    throw new Error("OpenAI API key not found. Please add your API key in Settings.");
  }
  
  try {
    // This would be replaced with a real API call
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Return mock data for now
        // In production, this would be the result of the API call
        resolve({
          executiveSummary: "Based on the analyzed document content, this executive summary would reflect the actual content of the uploaded file, addressing the client's specific situation, challenges, and opportunities as outlined in the document.",
          strategicQuestions: [
            "This first question would be directly related to specific content from the uploaded document.",
            "This second question would address key points mentioned in the document.",
            "This third question would explore challenges identified in the document content.",
            "This fourth question would reference specific projects or initiatives mentioned in the document.",
            "This fifth question would address specific metrics or KPIs mentioned in the document.",
            "This sixth question would explore opportunities identified in the document.",
            "This seventh question would address timeline considerations from the document.",
            "This eighth question would reference specific stakeholders mentioned in the document.",
            "This ninth question would address specific technical concerns from the document.",
            "This tenth question would focus on strategic priorities mentioned in the document."
          ]
        });
      }, 2000);
    });
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw error;
  }
};

const InternalAnalysis = ({ client }: InternalAnalysisProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} is ready for analysis`,
      });
    }
  };
  
  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Check if API key is set in localStorage before showing the dialog
      const openaiApiKey = localStorage.getItem('openaiApiKey');
      
      // If API key is missing, show the dialog and stop analysis
      if (!openaiApiKey) {
        setShowApiKeyDialog(true);
        setIsLoading(false);
        return;
      }
      
      // Process document to extract content
      const fileContent = await processDocumentContent(file);
      
      // Get analysis based on document content
      const result = await analyzeDocument(client.name, fileContent);
      
      setAnalysisData(result);
      toast({
        title: "Analysis complete",
        description: "Document has been successfully analyzed",
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      toast({
        title: "File selected",
        description: `${e.dataTransfer.files[0].name} is ready for analysis`,
      });
    }
  };
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openaiApiKey', apiKey.trim());
      setShowApiKeyDialog(false);
      toast({
        title: "API Key saved",
        description: "Your API key has been saved. You can update it anytime in Settings.",
      });
      // Proceed with analysis
      handleAnalyze();
    } else {
      toast({
        title: "API Key required",
        description: "Please enter a valid API key to continue.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="stats-card">
        <h3 className="card-header mb-4">Internal Data Analysis</h3>
        <p className="text-gray-600 mb-4">
          Upload internal data (CSV, TXT, or PDF) to generate strategic insights and questions for client meetings.
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
                {file ? file.name : 'Drag and drop a file, or click to browse'}
              </p>
              <p className="text-xs text-gray-500">
                Supports CSV, TXT, and PDF up to 10MB
              </p>
              
              <label className="mt-2 cursor-pointer">
                <span className="text-sm text-primary">Browse files</span>
                <input 
                  type="file" 
                  accept=".csv,.txt,.pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !file} 
            className="w-full"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Document'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 flex items-start gap-1">
          <HelpCircle size={14} />
          <span>Your files are processed securely and not stored permanently on our servers.</span>
        </div>
      </div>
      
      {isLoading && (
        <div className="stats-card flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Processing your document...</p>
          </div>
        </div>
      )}
      
      {analysisData && !isLoading && (
        <div className="space-y-4">
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <FileText className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Executive Summary</h3>
            </div>
            <p className="text-gray-600">{analysisData.executiveSummary}</p>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Strategic Questions to Ask</h3>
            </div>
            <ol className="space-y-3 list-decimal list-inside">
              {analysisData.strategicQuestions.map((question: string, index: number) => (
                <li key={index} className="text-gray-600">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              To analyze documents, an OpenAI API key is required. Please enter your API key below:
            </p>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Enter your OpenAI API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Your API key is stored locally and never sent to our servers.
                You can also save it in the <a href="/settings" className="text-primary hover:underline">Settings</a> page.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveApiKey}>
                Save & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternalAnalysis;
