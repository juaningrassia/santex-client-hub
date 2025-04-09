
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface InternalAnalysisProps {
  client: Client;
}

// Define the structure for analysis data
interface AnalysisData {
  executiveSummary: string;
  strategicQuestions: string[];
}

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});

const InternalAnalysis = ({ client }: InternalAnalysisProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: localStorage.getItem('openaiApiKey') || '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} is ready for analysis`,
      });
    }
  };
  
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
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
        // For PDF files, we would ideally use a PDF parsing library
        // For this example, we'll just return a message
        resolve("PDF content extraction would happen here. This is a placeholder text.");
      } else {
        // For text files like CSV, TXT
        reader.readAsText(file);
      }
    });
  };
  
  const analyzeWithOpenAI = async (content: string, apiKey: string): Promise<AnalysisData> => {
    try {
      const prompt = `You are a senior B2B Account Manager with deep experience in customer strategy, sales, and business consulting.

You will receive internal client information in plain text format (from a CSV or TXT file uploaded by an Account Manager). Your job is to analyze this content and generate two clear, useful outputs.

⚠️ Very important:
- ONLY use the information provided. Do not invent or assume anything.
- If something is missing (e.g. business goals), state it clearly.
- Your tone should be professional, insightful, and focused on business value.

---

🧠 Part 1: Executive Summary  
Write a concise and actionable summary based only on the provided input. Use short paragraphs or bullet points.

Include:
- General description of the client and current situation (if mentioned)
- Business goals (only if explicitly or implicitly mentioned)
- Products/services purchased and their status
- Problems or risks mentioned in the text
- Opportunities for growth or improvement
- Final recommendations for the Account Manager

---

❓ Part 2: 10 Strategic Questions  
Generate 10 smart and specific questions that an Account Manager should ask this client. These questions should:

- Be directly inspired by the information in the input
- Help uncover needs, blockers, or opportunities
- Encourage strategic and business-oriented conversations

Avoid generic questions. If the input is too limited to create 10 strong questions, generate fewer and explain why.

---

Here is the internal client information:

${content}

Please format your response as a valid JSON object with the following structure:
{
  "executiveSummary": "Your executive summary here...",
  "strategicQuestions": ["Question 1", "Question 2", ...]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that analyzes client data and provides business insights."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error communicating with OpenAI');
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        executiveSummary: result.executiveSummary,
        strategicQuestions: result.strategicQuestions
      };
    } catch (error) {
      console.error('Error analyzing with OpenAI:', error);
      throw error;
    }
  };
  
  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze",
        variant: "destructive"
      });
      return;
    }
    
    // Check if OpenAI API key is available in localStorage
    const apiKey = localStorage.getItem('openaiApiKey');
    
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Read file content
      const content = await readFileContent(file);
      setFileContent(content);
      
      // Analyze with OpenAI
      const analysis = await analyzeWithOpenAI(content, apiKey);
      setAnalysisData(analysis);
      
      toast({
        title: "Analysis complete",
        description: "Document has been successfully analyzed",
      });
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitApiKey = async (values: z.infer<typeof formSchema>) => {
    localStorage.setItem('openaiApiKey', values.apiKey);
    setShowApiKeyDialog(false);
    
    // Proceed with analysis
    handleAnalyze();
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
        <h3 className="card-header mb-4">Análisis de Datos Internos</h3>
        <p className="text-gray-600 mb-4">
          Sube datos internos (CSV, TXT o PDF) para generar insights estratégicos y preguntas para reuniones con clientes.
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
                {file ? file.name : 'Arrastra y suelta un archivo, o haz clic para explorar'}
              </p>
              <p className="text-xs text-gray-500">
                Soporta CSV, TXT y PDF hasta 10MB
              </p>
              
              <label className="mt-2 cursor-pointer">
                <span className="text-sm text-primary">Explorar archivos</span>
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
            {isLoading ? 'Analizando...' : 'Analizar Documento'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 flex items-start gap-1">
          <HelpCircle size={14} />
          <span>Tus archivos se procesan de forma segura y no se almacenan permanentemente en nuestros servidores.</span>
        </div>
      </div>
      
      {isLoading && (
        <div className="stats-card flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600">Procesando tu documento...</p>
          </div>
        </div>
      )}
      
      {analysisData && !isLoading && (
        <div className="space-y-4">
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <FileText className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Resumen Ejecutivo</h3>
            </div>
            <div className="text-gray-600 whitespace-pre-line">{analysisData.executiveSummary}</div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Preguntas Estratégicas</h3>
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

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>OpenAI API Key Required</DialogTitle>
            <DialogDescription>
              Para analizar documentos, necesitas proporcionar tu clave API de OpenAI. 
              Puedes configurarla permanentemente en la página de Configuración.
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
                <Button type="submit">Continuar con el análisis</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternalAnalysis;
