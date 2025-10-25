
import React from 'react';

interface CanvasBlockProps {
  title: string;
  content: string;
  color?: string;
}

const CanvasBlock: React.FC<CanvasBlockProps> = ({ title, content, color = 'bg-slate-50' }) => {
  // Simple check to see if content is a list
  const isList = content.includes('- ') || content.includes('* ') || content.includes('\n');

  const renderContent = () => {
    if (!content) {
        return <p className="text-slate-400 italic">Noch nicht definiert.</p>
    }
    if (isList) {
        return (
            <ul className="list-disc list-inside space-y-1">
                {content.split(/[-\*\n]/).map((item, index) => item.trim() && <li key={index}>{item.trim()}</li>)}
            </ul>
        );
    }
    return <p>{content}</p>;
  }


  return (
    <div className={`p-4 rounded-lg border border-slate-200 h-full flex flex-col ${color}`}>
      <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-300 pb-2">{title}</h4>
      <div className="text-slate-600 whitespace-pre-wrap text-xs flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default CanvasBlock;
