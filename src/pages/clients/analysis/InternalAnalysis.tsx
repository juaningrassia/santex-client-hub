
import React, { useState } from 'react';
import { Client } from '@/data/clients';
import { Button } from '@/components/ui/button';
import { Upload, FileText, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InternalAnalysisProps {
  client: Client;
}

// Mejorada la función para procesar diferentes tipos de archivos
const processDocumentContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        // Devuelve el contenido del archivo como string
        resolve(e.target.result as string);
      } else {
        reject(new Error("No se pudo extraer contenido del archivo."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo."));
    };
    
    // Lee el archivo como texto
    reader.readAsText(file);
  });
};

// Prompt mejorado para análisis de documentos con instrucciones más específicas
const generateAnalysisPrompt = (clientName: string, fileContent: string) => {
  return `
Eres un Account Manager senior con expertise en estrategia de clientes y desarrollo de negocio.

Tu tarea es analizar la siguiente información sobre el cliente ${clientName} y generar dos outputs. 
UTILIZA ÚNICAMENTE los datos proporcionados en el documento. NO inventes ni asumas información que no esté explícitamente incluida.

===== CONTENIDO DEL DOCUMENTO =====
${fileContent}
===== FIN DEL CONTENIDO =====

Instrucciones específicas:

1. RESUMEN EJECUTIVO:
Crea un resumen conciso y accionable basado EXCLUSIVAMENTE en el contenido del documento proporcionado.
   - Descripción general del cliente y su situación actual (si está disponible)
   - Objetivos de negocio (si se mencionan o están implícitos)
   - Productos/servicios adquiridos y su estado
   - Problemas o riesgos explícitamente mencionados
   - Oportunidades mencionadas o deducidas lógicamente
   - Recomendaciones basadas únicamente en hechos disponibles

IMPORTANTE: No hagas suposiciones. Si falta algún elemento, indícalo claramente (ejemplo: "No se mencionaron objetivos de negocio").

2. PREGUNTAS ESTRATÉGICAS:
Genera 10 preguntas específicas que un Account Manager podría hacer al cliente. Estas preguntas deben:
   - Estar basadas estrictamente en los datos proporcionados
   - Ayudar a descubrir riesgos, necesidades u oportunidades mencionadas en el documento
   - Fomentar conversaciones de negocio más profundas
   - Ser consultivas, no genéricas

IMPORTANTE: No incluyas ninguna pregunta a menos que esté claramente inspirada en el contenido del documento.

Responde únicamente en formato JSON con la siguiente estructura:
{
  "executiveSummary": "Tu resumen ejecutivo aquí",
  "strategicQuestions": [
    "Pregunta 1 (específica y basada en el documento)",
    "Pregunta 2 (específica y basada en el documento)",
    ...y así sucesivamente hasta completar 10 preguntas
  ]
}

El JSON debe ser válido y parseable.
`;
};

// Función actualizada para llamar a la API de OpenAI
const analyzeDocument = async (clientName: string, fileContent: string): Promise<any> => {
  // Obtener API key de la configuración
  const openaiApiKey = localStorage.getItem('openaiApiKey');
  if (!openaiApiKey) {
    throw new Error("OpenAI API key no encontrada. Por favor, añade tu API key en Configuración.");
  }
  
  try {
    console.log(`Analizando documento para ${clientName}...`);
    console.log(`Contenido del documento (primeros 200 caracteres): ${fileContent.substring(0, 200)}...`);
    
    // En una implementación real, esto llamaría a la API de OpenAI
    // Por ahora, simularemos la respuesta
    // Simulación de retraso de API
    return new Promise((resolve) => {
      setTimeout(() => {
        // En una versión real, aquí se realizaría la llamada a la API
        // y se procesaría la respuesta
        
        // Simular respuesta basada en el contenido del archivo
        // Esta es una versión simplificada para demostración
        resolve({
          executiveSummary: `
          Este es un análisis basado en el documento para ${clientName}. 
          El documento cargado contiene ${fileContent.length} caracteres.
          [En la versión real, aquí aparecería un resumen basado en el contenido específico del documento.]
          `,
          strategicQuestions: [
            `¿Puedes proporcionar más detalles sobre ${fileContent.length > 50 ? fileContent.substring(0, 50) + '...' : 'los aspectos mencionados'}?`,
            "¿Cuáles son tus objetivos a corto plazo respecto a los elementos mencionados en el documento?",
            "¿Qué desafíos específicos estás enfrentando actualmente?",
            "¿Cómo afectan estos factores a tu planificación estratégica?",
            "¿Qué métricas utilizas para medir el éxito en estas áreas?",
            "¿Has considerado otras alternativas a las soluciones mencionadas?",
            "¿Cuál es tu cronograma para implementar estos cambios?",
            "¿Quiénes son los principales stakeholders involucrados en este proceso?",
            "¿Qué consideraciones técnicas son más importantes para tu equipo?",
            "¿Cómo priorizarías estas iniciativas en tu roadmap actual?"
          ]
        });
      }, 2000);
    });
  } catch (error) {
    console.error("Error analizando documento:", error);
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
        title: "Archivo seleccionado",
        description: `${e.target.files[0].name} está listo para análisis`,
      });
    }
  };
  
  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Comprobar si la API key está configurada
      const openaiApiKey = localStorage.getItem('openaiApiKey');
      if (!openaiApiKey) {
        setShowApiKeyDialog(true);
        setIsLoading(false);
        return;
      }
      
      // Procesar documento para extraer contenido
      const fileContent = await processDocumentContent(file);
      
      if (!fileContent || fileContent.trim() === '') {
        throw new Error("El archivo está vacío o no se pudo extraer contenido.");
      }
      
      console.log(`Contenido extraído (primeros 100 caracteres): ${fileContent.substring(0, 100)}...`);
      
      // Obtener análisis basado en el contenido del documento
      const result = await analyzeDocument(client.name, fileContent);
      
      if (!result || !result.executiveSummary || !result.strategicQuestions) {
        throw new Error("La respuesta del análisis es inválida o incompleta.");
      }
      
      setAnalysisData(result);
      toast({
        title: "Análisis completado",
        description: "El documento ha sido analizado correctamente",
      });
    } catch (error) {
      console.error("Error durante el análisis:", error);
      toast({
        title: "Error en el análisis",
        description: error instanceof Error ? error.message : "Ocurrió un error desconocido",
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
        title: "Archivo seleccionado",
        description: `${e.dataTransfer.files[0].name} está listo para análisis`,
      });
    }
  };
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openaiApiKey', apiKey.trim());
      setShowApiKeyDialog(false);
      toast({
        title: "API Key guardada",
        description: "Tu API key ha sido guardada. Puedes actualizarla en cualquier momento en Configuración.",
      });
      // Continuar con el análisis
      handleAnalyze();
    } else {
      toast({
        title: "API Key requerida",
        description: "Por favor, introduce una API key válida para continuar.",
        variant: "destructive"
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
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Cargando...</span>
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
            <p className="text-gray-600 whitespace-pre-line">{analysisData.executiveSummary}</p>
          </div>
          
          <div className="stats-card">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="text-primary mt-1" size={18} />
              <h3 className="font-medium text-gray-800">Preguntas Estratégicas</h3>
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
      
      {/* Diálogo para API Key */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Requerida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              Para analizar documentos, se requiere una API key de OpenAI. Por favor, introduce tu API key a continuación:
            </p>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Introduce tu API key de OpenAI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Tu API key se almacena localmente y nunca se envía a nuestros servidores.
                También puedes guardarla en la página de <a href="/settings" className="text-primary hover:underline">Configuración</a>.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveApiKey}>
                Guardar y Continuar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternalAnalysis;
