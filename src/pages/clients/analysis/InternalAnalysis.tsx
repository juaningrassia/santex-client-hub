
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface InternalAnalysisProps {
  client: Client;
}

// Mock API response data with the new format
const mockAnalysisData = {
  executiveSummary: `Restaurant Brands International (RBI) is in a growth phase, with plans to expand their global footprint in the QSR industry. They've recently invested in digital transformation initiatives to enhance customer experience across their brands (Burger King, Tim Hortons, Popeyes, and Firehouse Subs).

Their primary business goal is to increase same-store sales by 5% while opening 1,800 new locations globally by the end of 2025. They've purchased our enterprise CRM solution and mobile ordering platform, but implementation in key markets is behind schedule by approximately 2 months.

RBI is facing increased competition in the QSR space and rising operational costs due to inflation and supply chain disruptions. Additionally, they're struggling with inconsistent brand experience across franchised locations.

There are significant opportunities to expand our relationship through our loyalty program integration and data analytics package, which would address their customer retention challenges and provide actionable insights for their marketing team.

We recommend prioritizing the completion of the mobile ordering platform implementation, proposing our analytics solution to address franchise consistency issues, and developing a roadmap for potential loyalty program integration in Q3.`,
  strategicQuestions: [
    "Given your aggressive expansion target of 1,800 new locations, which specific markets are you prioritizing, and how can our technology better support those regional rollouts?",
    "Your mobile ordering implementation is currently 2 months behind schedule. What specific challenges are you facing with the deployment, and how can we restructure our approach to accelerate adoption?",
    "How are you currently measuring and addressing the inconsistent brand experience across franchised locations, and what data points would be most valuable to track?",
    "Your competitors are gaining market share in the delivery segment. How satisfied are you with your current delivery integration, and what improvements would make the biggest impact on your business?",
    "We've noticed your marketing team is manually aggregating customer data from multiple sources. How much time could they save with an integrated analytics solution, and what insights are they currently missing?",
    "What specific metrics are your C-suite executives tracking to measure digital transformation ROI, and how frequently are these being reported?",
    "The loyalty program integration we discussed could potentially increase customer retention by 23%. What concerns do you have about implementing this solution across your franchise network?",
    "How are your franchisees responding to the new technology implementations, and what resistance points have you encountered that we should address together?",
    "Your international expansion requires localization of both menu and technology. Which markets are presenting the biggest localization challenges that we could help solve?",
    "What is your timeline for making a decision on the analytics package, and what specific ROI metrics would you need to see to move forward with implementation?"
  ]
};

const InternalAnalysis = ({ client }: InternalAnalysisProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<typeof mockAnalysisData | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} is ready for analysis`,
      });
    }
  };
  
  const handleAnalyze = () => {
    if (!file) return;
    
    setIsLoading(true);
    
    // Updated GPT prompt with more data-driven requirements
    const gptPrompt = `You are a senior B2B Account Manager with expertise in customer strategy and business development.

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

Here is the internal client information:

[Content from the uploaded file will be inserted here]`;
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setIsLoading(false);
      toast({
        title: "Analysis complete",
        description: "Your document has been processed successfully",
      });
    }, 2000);
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
            <div className="text-gray-600 whitespace-pre-line">
              {analysisData.executiveSummary}
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Strategic Questions to Ask</h3>
            </div>
            <ol className="space-y-3 list-decimal list-inside">
              {analysisData.strategicQuestions.map((question, index) => (
                <li key={index} className="text-gray-600">
                  {question}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAnalysis;
