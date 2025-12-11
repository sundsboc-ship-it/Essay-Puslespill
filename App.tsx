import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, BookOpen, Layers, Layout, HelpCircle } from 'lucide-react';
import { EssayBlock, BlockType } from './types';
import EssayBlockCard from './components/EssayBlockCard';
import FocusEditor from './components/FocusEditor';
import { getStructuralAdvice } from './services/geminiService';

const INITIAL_BLOCKS: EssayBlock[] = [
  { id: '1', type: BlockType.INTRODUCTION, title: 'Innledning', content: '', order: 0 },
  { id: '2', type: BlockType.CLAIM, title: 'Hovedpåstand', content: '', order: 1 },
  { id: '3', type: BlockType.EVIDENCE, title: 'Første Bevis', content: '', order: 2 },
  { id: '4', type: BlockType.REFLECTION, title: 'Min Drøfting', content: '', order: 3 },
  { id: '5', type: BlockType.CONCLUSION, title: 'Konklusjon', content: '', order: 4 },
];

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<EssayBlock[]>(INITIAL_BLOCKS);
  const [activeBlock, setActiveBlock] = useState<EssayBlock | null>(null);
  const [structuralFeedback, setStructuralFeedback] = useState<string>('');

  const addBlock = (type: BlockType) => {
    const newBlock: EssayBlock = {
      id: uuidv4(),
      type,
      title: type === BlockType.CLAIM ? 'Ny Påstand' : 
             type === BlockType.EVIDENCE ? 'Nytt Bevis' : 
             type === BlockType.REFLECTION ? 'Ny Drøfting' : 'Ny Seksjon',
      content: '',
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockContent = (id: string, newContent: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    }
    setBlocks(newBlocks);
  };

  const handleGetStructureAdvice = async () => {
    const types = blocks.map(b => b.type);
    const feedback = await getStructuralAdvice(types);
    setStructuralFeedback(feedback);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-gray-800 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-stone-800 text-white p-2 rounded-lg">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">Essay Puslespillet</h1>
            <p className="text-xs text-stone-500">Montessori Strukturverktøy</p>
          </div>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={handleGetStructureAdvice}
                className="text-stone-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
            >
                <HelpCircle size={16} /> Sjekk Flyt
            </button>
        </div>
      </header>

      {/* Main Workspace (Horizontal Timeline) */}
      <main className="p-8 overflow-x-auto">
        
        {/* Advice Banner */}
        {structuralFeedback && (
            <div className="mb-8 max-w-4xl mx-auto bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-3 rounded-lg flex items-start gap-3 animate-fade-in">
                <BookOpen size={20} className="mt-0.5 shrink-0" />
                <p className="text-sm">{structuralFeedback}</p>
                <button onClick={() => setStructuralFeedback('')} className="ml-auto text-indigo-400 hover:text-indigo-600"><Plus size={16} className="rotate-45" /></button>
            </div>
        )}

        {/* Timeline Line */}
        <div className="relative min-w-max mx-auto pt-10 px-10">
            {/* The literal line behind cards */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-0 rounded-full"></div>

            <div className="flex gap-6 items-center relative z-10">
                {blocks.map((block, index) => (
                    <EssayBlockCard 
                        key={block.id}
                        block={block}
                        onEdit={setActiveBlock}
                        onDelete={deleteBlock}
                        onMoveUp={(id) => moveBlock(id, 'up')}
                        onMoveDown={(id) => moveBlock(id, 'down')}
                        isFirst={index === 0}
                        isLast={index === blocks.length - 1}
                    />
                ))}

                {/* Add New Block Button */}
                <div className="h-48 flex items-center">
                    <div className="group relative">
                         <button className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 hover:scale-110 transition-all shadow-sm">
                            <Plus size={24} />
                         </button>
                         {/* Dropdown for type selection */}
                         <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 bg-white rounded-xl shadow-xl border border-stone-100 p-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col gap-1 z-20">
                            <span className="text-xs font-bold text-gray-400 px-2 py-1 uppercase">Legg til blokk</span>
                            <button onClick={() => addBlock(BlockType.CLAIM)} className="text-left px-3 py-2 text-sm hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> Påstand
                            </button>
                            <button onClick={() => addBlock(BlockType.EVIDENCE)} className="text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Bevis
                            </button>
                            <button onClick={() => addBlock(BlockType.REFLECTION)} className="text-left px-3 py-2 text-sm hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Drøfting
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-stone-200 p-4 text-center">
        <p className="text-sm text-stone-500 max-w-2xl mx-auto">
          <span className="font-bold text-stone-700">Tips:</span> Start med tidslinjen. Klikk på "Zoom Inn" for å skrive innholdet. Bruk fargene for å sjekke om du har en god balanse mellom påstander (rød), bevis (blå) og dine egne tanker (grønn).
        </p>
      </footer>

      {/* Zoomed In Editor Modal */}
      {activeBlock && (
        <FocusEditor 
            block={activeBlock} 
            onClose={() => setActiveBlock(null)}
            onUpdate={updateBlockContent}
        />
      )}
    </div>
  );
};

export default App;