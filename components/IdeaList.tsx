import React from 'react';
import { Idea } from '../types';
import { Archive, Trash2, CheckCircle, XCircle, FileText } from 'lucide-react';

interface IdeaListProps {
  ideas: Idea[];
  onDelete: (id: string) => void;
  onViewSpec: (idea: Idea) => void;
}

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onDelete, onViewSpec }) => {
  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30 text-slate-400">
        <Archive className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-lg font-medium">Your Idea Register is empty</p>
        <p className="text-sm">Start a Discovery Session to fill it up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <Archive className="w-5 h-5 text-indigo-400" />
        Idea Register
      </h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {ideas.map((idea) => (
          <div key={idea.id} className="relative group bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-indigo-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {idea.domain}
              </span>
              <div className="flex gap-2">
                {idea.spec && (
                    <button 
                        onClick={() => onViewSpec(idea)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded transition"
                        title="View Spec"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={() => onDelete(idea.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{idea.name}</h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{idea.summary}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-3">
              <span>{idea.date}</span>
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
                idea.status === 'Built' ? 'bg-green-500/10 text-green-400' :
                idea.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                {idea.status === 'Built' ? <CheckCircle className="w-3 h-3" /> :
                 idea.status === 'Rejected' ? <XCircle className="w-3 h-3" /> :
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                {idea.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaList;
