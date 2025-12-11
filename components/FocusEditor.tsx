import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, ArrowLeft } from 'lucide-react';
import { EssayBlock, BlockType, AnalysisResult, SentenceType } from '../types';
import { analyzeEssayBlock } from '../services/geminiService';
import BalanceChart from './BalanceChart';

interface FocusEditorProps {
  block: EssayBlock;
  onClose: () => void;
  onUpdate: (id: string, newContent: string) => void;
}

const FocusEditor: React.FC<FocusEditorProps> = ({ block, onClose, onUpdate }) => {
  const [content, setContent] = useState(block.content);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Sync internal state if prop changes (though usually this component is mounted fresh)
  useEffect(() => {
    setContent(block.content);
  }, [block.id]);

  const handleSave = () => {
    onUpdate(block.id, content);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeEssayBlock(content);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Helper to get border color based on sentence type
  const getSentenceStyle = (type: SentenceType) => {
    switch (type) {
      case SentenceType.CLAIM: return 'bg-red-100 border-b-2 border-red-400 text-red-900';
      case SentenceType.EVIDENCE: return 'bg-blue-100 border-b-2 border-blue-400 text-blue-900';
      case SentenceType.REFLECTION: return 'bg-emerald-100 border-b-2 border-emerald-400 text-emerald-900';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-[#fdfbf7] w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-white ring-1 ring-gray-200">
        
        {/* Left Side: Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { handleSave(); onClose(); }}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{block.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  block.type === BlockType.CLAIM ? 'bg-red-100 text-red-700' :
                  block.type === BlockType.EVIDENCE ? 'bg-blue-100 text-blue-700' :
                  block.type === BlockType.REFLECTION ? 'bg-emerald-100 text-emerald-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {block.type}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm font-medium shadow-sm"
              >
                {isAnalyzing ? <Wand2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Analyser Tekst
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-white">
            <textarea
              value={content}
              onChange={(e) => {
                 setContent(e.target.value);
                 handleSave(); 
              }}
              placeholder="Skriv teksten din her..."
              className="w-full h-full p-8 text-lg leading-relaxed text-gray-800 resize-none focus:outline-none placeholder:text-gray-300 font-serif"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Side: Analysis & Feedback */}
        <div className="w-full md:w-96 bg-gray-50 flex flex-col overflow-y-auto border-l border-gray-100">
          <div className="p-6 space-y-6">
            
            {/* Legend */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Grammatikksymboler 2.0</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-sm text-gray-600">Påstand (Hovedsetning)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-sm text-gray-600">Bevis (Kilde/Fakta)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-sm text-gray-600">Refleksjon (Drøfting)</span>
                </div>
              </div>
            </div>

            {/* Visualizer */}
            <BalanceChart analysis={analysis} />

            {/* Sentence Breakdown */}
            {analysis && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Analysert Innhold</h3>
                <div className="space-y-2 text-sm leading-relaxed">
                  {analysis.sentences.map((sent, idx) => (
                    <span key={idx} className={`inline decoration-clone px-1 py-0.5 rounded mx-0.5 ${getSentenceStyle(sent.type)}`}>
                      {sent.text}{' '}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!analysis && !isAnalyzing && (
              <div className="text-center py-10 text-gray-400 px-6">
                <Wand2 className="mx-auto mb-3 opacity-20" size={48} />
                <p className="text-sm">Klikk på "Analyser Tekst" for å se fargekodingen og balansen i avsnittet ditt.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEditor;