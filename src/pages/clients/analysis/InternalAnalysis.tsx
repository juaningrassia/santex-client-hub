
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface InternalAnalysisProps {
  client: Client;
}

// Mock API response data
const mockAnalysisData = {
  executiveSummary: "Based on the internal data provided, Acme Corporation shows strong growth potential but has several areas requiring attention. Their customer satisfaction scores are trending positively (up 12% YoY), but there are notable gaps in their product deployment strategy that need addressing.",
  strategicQuestions: [
    "What progress has been made on the cloud migration project that was projected to reduce infrastructure costs by 30%?",
    "Has the customer success team implemented the new onboarding process that was discussed during our last quarterly review?",
    "How are you planning to address the 15% churn rate we're seeing in the SMB segment?",
    "What resources do you need from our team to accelerate the implementation of the new security features?",
    "Are there any regulatory concerns with the upcoming product launch in European markets?",
    "How successful was the pilot program for the new enterprise solution?",
    "Which competitors are you most concerned about in the next 6-12 months?",
    "What's your timeline for expanding the development team that was mentioned in our last meeting?",
    "Have you resolved the integration issues with our API that were reported last quarter?",
    "What are your top three strategic priorities for the next fiscal year?"
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
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setIsLoading(false);
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
            <p className="text-gray-600">{analysisData.executiveSummary}</p>
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
