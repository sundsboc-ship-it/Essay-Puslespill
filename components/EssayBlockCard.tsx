import React from 'react';
import { EssayBlock, BlockType } from '../types';
import { GripVertical, Maximize2, Trash2 } from 'lucide-react';

interface EssayBlockCardProps {
  block: EssayBlock;
  onEdit: (block: EssayBlock) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

const EssayBlockCard: React.FC<EssayBlockCardProps> = ({ 
  block, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast 
}) => {
  
  const getTypeColor = (type: BlockType) => {
    switch (type) {
      case BlockType.CLAIM: return 'border-red-400 bg-red-50 hover:bg-red-100';
      case BlockType.EVIDENCE: return 'border-blue-400 bg-blue-50 hover:bg-blue-100';
      case BlockType.REFLECTION: return 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100';
      case BlockType.INTRODUCTION: return 'border-slate-400 bg-slate-50 hover:bg-slate-100';
      case BlockType.CONCLUSION: return 'border-slate-400 bg-slate-50 hover:bg-slate-100';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getTypeBadge = (type: BlockType) => {
    switch (type) {
      case BlockType.CLAIM: return 'bg-red-100 text-red-700';
      case BlockType.EVIDENCE: return 'bg-blue-100 text-blue-700';
      case BlockType.REFLECTION: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className={`group relative flex flex-col w-64 h-48 rounded-xl shadow-sm border-2 transition-all duration-300 ${getTypeColor(block.type)} hover:shadow-md hover:-translate-y-1`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1">
            <GripVertical size={16} />
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider ${getTypeBadge(block.type)}`}>
            {block.type === BlockType.INTRODUCTION ? 'Innledning' : 
             block.type === BlockType.CONCLUSION ? 'Konklusjon' :
             block.type === BlockType.CLAIM ? 'Påstand' :
             block.type === BlockType.EVIDENCE ? 'Bevis' : 'Drøfting'}
          </span>
        </div>
        <button 
          onClick={() => onDelete(block.id)}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Content Preview */}
      <div className="flex-1 p-3 overflow-hidden" onClick={() => onEdit(block)}>
        <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 cursor-pointer">
          {block.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-4 cursor-pointer font-serif leading-relaxed">
          {block.content || <span className="italic opacity-50">Klikk for å skrive...</span>}
        </p>
      </div>

      {/* Action Footer */}
      <div className="p-2 border-t border-black/5 flex justify-between items-center bg-white/30 backdrop-blur-sm rounded-b-lg">
        <div className="flex gap-1">
            <button 
                onClick={() => onMoveUp(block.id)} 
                disabled={isFirst}
                className="p-1 hover:bg-black/5 rounded disabled:opacity-30"
            >
                ▲
            </button>
            <button 
                onClick={() => onMoveDown(block.id)} 
                disabled={isLast}
                className="p-1 hover:bg-black/5 rounded disabled:opacity-30"
            >
                ▼
            </button>
        </div>
        <button 
          onClick={() => onEdit(block)}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white/50 px-2 py-1 rounded hover:bg-white shadow-sm transition-all"
        >
          <Maximize2 size={12} />
          <span>Zoom Inn</span>
        </button>
      </div>
    </div>
  );
};

export default EssayBlockCard;