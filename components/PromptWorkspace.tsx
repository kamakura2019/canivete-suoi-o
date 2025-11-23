import React, { useState, useEffect, useRef } from 'react';
import { Category, ToolType, PromptRequestPayload, GeneratedResult } from '../types';
import { TOOLS } from '../constants';
import { generatePromptResponse } from '../services/geminiService';
import Icon from './Icon';

interface PromptWorkspaceProps {
  category: Category;
}

const PromptWorkspace: React.FC<PromptWorkspaceProps> = ({ category }) => {
  const [selectedTool, setSelectedTool] = useState<ToolType>(ToolType.GENERATOR);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear state when category changes
  useEffect(() => {
    setInput('');
    setOutput(null);
    setSelectedImage(null);
    // Reset to generator if switching categories unless we want to persist
  }, [category]);

  const handleGenerate = async () => {
    if (!input.trim() && !selectedImage) return;
    if (selectedTool === ToolType.IMAGE_EDITOR && !selectedImage) return;

    setLoading(true);
    setOutput(null);
    try {
      const payload: PromptRequestPayload = {
        input,
        category,
        toolType: selectedTool,
        image: selectedImage || undefined
      };
      
      const result = await generatePromptResponse(payload);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput({ content: "Erro ao gerar resposta. Tente novamente.", type: 'text' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output?.type === 'text') {
      navigator.clipboard.writeText(output.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const currentToolDef = TOOLS.find(t => t.id === selectedTool);
  const isImageMode = selectedTool === ToolType.IMAGE_EDITOR;

  return (
    <div className="flex-1 h-full flex flex-col w-full p-4 md:p-8 lg:pr-12 max-w-[1800px] mx-auto">
      
      {/* Creative Header & Tool Selection */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                <Icon name={category.icon} className="text-primary" size={24} />
             </div>
             <h2 className="text-4xl font-light text-white tracking-tighter">{category.name}</h2>
          </div>
          <p className="text-subtle text-sm max-w-lg leading-relaxed border-l-2 border-primary/30 pl-3">
            {category.description}
          </p>
        </div>

        {/* Minimalist Tabs with Active Glow */}
        <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-lg overflow-x-auto max-w-full no-scrollbar">
          {TOOLS.map((tool) => {
            const isActive = selectedTool === tool.id;
            const isMagic = tool.id === ToolType.IMAGE_EDITOR;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id);
                  setOutput(null);
                }}
                className={`
                  relative px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-500 flex items-center gap-2 whitespace-nowrap overflow-hidden
                  ${isActive ? 'text-white' : 'text-subtle hover:text-gray-300'}
                `}
              >
                {isActive && (
                  <div 
                    className={`absolute inset-0 rounded-full opacity-100 transition-opacity duration-300 ${isMagic ? 'bg-secondary/20 border border-secondary/30' : 'bg-primary/20 border border-primary/30'}`} 
                  />
                )}
                {/* Scanline effect for Magic Editor */}
                {isActive && isMagic && <div className="absolute inset-0 scanline opacity-30 rounded-full" />}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon name={tool.icon} size={14} className={isActive ? (isMagic ? 'text-secondary' : 'text-primary') : ''} />
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace - Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 pb-4 relative z-10">
        
        {/* Left Panel: Input / Upload */}
        <div className={`
          flex flex-col h-full glass-panel rounded-2xl overflow-hidden transition-all duration-500 group
          ${isImageMode ? 'border-secondary/20 shadow-glow-teal' : 'hover:border-white/10'}
        `}>
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${input.trim() || selectedImage ? (isImageMode ? 'bg-secondary' : 'bg-emerald-400') : 'bg-subtle'}`} />
              <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
                {isImageMode ? 'Source Material' : 'Input Context'}
              </span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded border backdrop-blur-sm transition-colors duration-300
              ${isImageMode ? 'text-secondary bg-secondary/10 border-secondary/20' : 'text-subtle bg-white/5 border-white/5'}`}>
              {currentToolDef?.name} Mode
            </span>
          </div>
          
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Image Upload Area for Magic Editor */}
            {isImageMode && (
               <div 
                 className={`
                   relative m-6 mb-0 p-8 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
                   ${selectedImage ? 'border-secondary/50 bg-secondary/5' : 'border-white/10 hover:border-secondary/30 hover:bg-white/5'}
                 `}
                 onClick={triggerFileInput}
               >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   accept="image/*" 
                   className="hidden" 
                 />
                 
                 {selectedImage ? (
                   <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
                     <img src={selectedImage} alt="Upload preview" className="max-h-full max-w-full object-contain rounded shadow-lg" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">Click to change</span>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center group-hover:scale-105 transition-transform duration-300">
                     <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3 text-secondary">
                        <Icon name="Upload" size={20} />
                     </div>
                     <p className="text-sm text-gray-300 font-medium">Click to upload image</p>
                     <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                   </div>
                 )}
               </div>
            )}

            <textarea
              className={`
                flex-1 w-full bg-transparent p-6 resize-none focus:outline-none text-gray-200 placeholder-gray-600 font-mono text-sm leading-relaxed
                ${isImageMode ? 'h-32 flex-none border-t border-white/5 mt-4' : 'h-full'}
              `}
              placeholder={
                isImageMode ? "// Describe how you want to edit the image (e.g. 'Add a retro filter', 'Remove the background')..." :
                selectedTool === ToolType.GENERATOR ? "// Describe your idea here..." :
                selectedTool === ToolType.REFINER ? "// Paste the prompt you want to refine..." :
                selectedTool === ToolType.PERSONA ? "// Describe the persona or role..." :
                "// Paste prompt for analysis..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="p-5 border-t border-white/5 bg-white/[0.01]">
            <button
              onClick={handleGenerate}
              disabled={loading || (isImageMode && !selectedImage) || (!isImageMode && !input.trim())}
              className={`
                w-full py-4 px-6 rounded-xl font-medium text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300
                ${loading || (isImageMode && !selectedImage) || (!isImageMode && !input.trim())
                  ? 'bg-surfaceLight text-subtle cursor-not-allowed border border-white/5' 
                  : isImageMode 
                    ? 'bg-secondary text-black shadow-glow-teal hover:bg-[#5eead4] hover:scale-[1.01]' 
                    : 'bg-primary text-white shadow-glow hover:bg-primaryDark hover:scale-[1.01]'}
              `}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin" size={16} /> PROCESSING...
                </>
              ) : (
                <>
                  <Icon name={isImageMode ? "Wand2" : "Sparkles"} size={16} /> 
                  {isImageMode ? 'Magic Edit' : 'Generate Output'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className={`
          flex flex-col h-full glass-panel rounded-2xl overflow-hidden relative transition-all duration-500
          ${output ? (output.type === 'image' ? 'border-secondary/20' : 'border-primary/20') : ''}
        `}>
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${output ? (output.type === 'image' ? 'bg-secondary shadow-[0_0_8px_rgba(45,212,191,0.4)]' : 'bg-primary shadow-[0_0_8px_rgba(167,139,250,0.4)]') : 'bg-subtle'}`} />
               <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">AI Response</span>
            </div>
            
            {output && output.type === 'text' && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-subtle hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                {copied ? <Icon name="Check" size={14} className="text-emerald-400" /> : <Icon name="Copy" size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
             {output && output.type === 'image' && (
              <a 
                href={output.content} 
                download="magic-edit-result.png"
                className="flex items-center gap-1.5 text-xs font-medium text-subtle hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <Icon name="Download" size={14} />
                Download
              </a>
            )}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col">
            {output ? (
              output.type === 'image' ? (
                <div className="flex-1 flex items-center justify-center min-h-[300px] animate-in fade-in zoom-in duration-500">
                  <div className="relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                     <img src={output.content} alt="Edited Result" className="relative rounded-lg shadow-2xl border border-white/10 max-w-full max-h-[600px]" />
                  </div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed bg-transparent border-none p-0">
                    {output.content}
                  </pre>
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-subtle gap-6 opacity-30">
                 <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative backdrop-blur-xl">
                     <Icon name={isImageMode ? "Image" : "Bot"} size={40} />
                   </div>
                 </div>
                 <p className="text-xs tracking-[0.2em] uppercase text-center font-light">
                   {isImageMode ? 'Awaiting visual input' : 'System ready'}
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromptWorkspace;