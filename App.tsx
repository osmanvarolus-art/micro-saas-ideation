import React, { useState, useEffect } from 'react';
import { Idea } from './types';
import IdeaList from './components/IdeaList';
import SessionWizard from './components/SessionWizard';
import MarkdownRenderer from './components/MarkdownRenderer';
import { Plus, LayoutDashboard, Github, X } from 'lucide-react';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [view, setView] = useState<'DASHBOARD' | 'WIZARD' | 'VIEW_SPEC'>('DASHBOARD');
  const [viewingIdea, setViewingIdea] = useState<Idea | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('micro_saas_ideas');
    if (saved) {
      try {
        setIdeas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse ideas", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('micro_saas_ideas', JSON.stringify(ideas));
  }, [ideas]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      setIdeas(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSaveIdea = (newIdea: Idea) => {
    setIdeas(prev => [newIdea, ...prev]);
    setView('DASHBOARD');
  };

  const handleViewSpec = (idea: Idea) => {
    setViewingIdea(idea);
    setView('VIEW_SPEC');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">AI Discovery <span className="text-indigo-400">System v2.0</span></h1>
          </div>
          <div className="flex items-center gap-4">
             {view === 'DASHBOARD' && (
                <button
                  onClick={() => setView('WIZARD')}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-white/5"
                >
                  <Plus className="w-4 h-4" />
                  New Session
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {view === 'DASHBOARD' && (
          <IdeaList 
            ideas={ideas} 
            onDelete={handleDelete} 
            onViewSpec={handleViewSpec}
          />
        )}

        {view === 'WIZARD' && (
          <SessionWizard 
            existingIdeas={ideas}
            onSaveIdea={handleSaveIdea}
            onCancel={() => setView('DASHBOARD')}
          />
        )}

        {view === 'VIEW_SPEC' && viewingIdea && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-4 flex items-center justify-between">
                    <button 
                        onClick={() => setView('DASHBOARD')}
                        className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
                    >
                         ← Back to Dashboard
                    </button>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                            {viewingIdea.domain}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                            {viewingIdea.date}
                        </span>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700 bg-slate-900/50">
                        <h1 className="text-2xl font-bold text-white mb-2">{viewingIdea.name}</h1>
                        <p className="text-lg text-slate-400">{viewingIdea.summary}</p>
                    </div>
                    <div className="p-8 bg-slate-900">
                        {viewingIdea.spec 
                            ? <MarkdownRenderer content={viewingIdea.spec} /> 
                            : <div className="text-center text-slate-500 py-10">No specification data available for this idea.</div>
                        }
                    </div>
                </div>
            </div>
        )}

      </main>
      
      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>Built with React & Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
