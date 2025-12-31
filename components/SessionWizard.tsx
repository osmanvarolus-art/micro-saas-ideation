import React, { useState } from 'react';
import { SessionState, Domain, Idea } from '../types';
import { generateDiscoveryIdeas, generateBuildSpec } from '../services/geminiService';
import { Loader2, ArrowRight, Save, Rocket, Sparkles, Check, ChevronRight } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { DOMAINS } from '../constants';

interface SessionWizardProps {
  existingIdeas: Idea[];
  onSaveIdea: (idea: Idea) => void;
  onCancel: () => void;
}

const SessionWizard: React.FC<SessionWizardProps> = ({ existingIdeas, onSaveIdea, onCancel }) => {
  const [state, setState] = useState<SessionState>({
    step: 'SETUP',
    domain: '',
    discoveryResult: '',
    selectedWinnerName: '',
    selectedWinnerSummary: '',
    specResult: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleStartDiscovery = async () => {
    if (!state.domain) return;
    setError(null);
    setState(prev => ({ ...prev, step: 'DISCOVERY_LOADING' }));
    
    try {
      const result = await generateDiscoveryIdeas(state.domain, existingIdeas);
      setState(prev => ({ ...prev, step: 'DISCOVERY_RESULT', discoveryResult: result }));
    } catch (err) {
      setError("Failed to generate ideas. Ensure your API Key is valid.");
      setState(prev => ({ ...prev, step: 'SETUP' }));
    }
  };

  const handleGenerateSpec = async () => {
    if (!state.selectedWinnerName || !state.selectedWinnerSummary) return;
    setError(null);
    setState(prev => ({ ...prev, step: 'SPEC_LOADING' }));

    try {
      const result = await generateBuildSpec(state.selectedWinnerName, state.selectedWinnerSummary);
      setState(prev => ({ ...prev, step: 'SPEC_RESULT', specResult: result }));
    } catch (err) {
      setError("Failed to generate spec.");
      setState(prev => ({ ...prev, step: 'DISCOVERY_RESULT' }));
    }
  };

  const handleSaveAndFinish = () => {
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      name: state.selectedWinnerName,
      summary: state.selectedWinnerSummary,
      domain: state.domain || 'Unknown',
      date: new Date().toLocaleDateString(),
      status: 'Exploring',
      spec: state.specResult
    };
    onSaveIdea(newIdea);
  };

  // --- Render Steps ---

  if (state.step === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            New Discovery Session
          </h2>
          <p className="text-slate-400">Choose a domain to analyze for micro-SaaS opportunities.</p>
        </div>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="space-y-4 mb-8">
          <label className="block text-sm font-medium text-slate-300">Target Domain</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => setState(s => ({ ...s, domain: d }))}
                className={`p-3 rounded-lg text-left text-sm font-medium transition-all border ${
                  state.domain === d
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-700">
          <button onClick={onCancel} className="px-4 py-2 text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            disabled={!state.domain}
            onClick={handleStartDiscovery}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
          >
            Start Analysis <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (state.step === 'DISCOVERY_LOADING' || state.step === 'SPEC_LOADING') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
        <h3 className="text-xl font-semibold text-white mb-2">
            {state.step === 'DISCOVERY_LOADING' ? 'Analyzing Market Opportunities...' : 'Architecting Solution...'}
        </h3>
        <p className="text-slate-400 text-center max-w-md">
            {state.step === 'DISCOVERY_LOADING' 
                ? 'Gemini is scanning the domain for pain points, scoring opportunities, and selecting a winner.' 
                : 'Generating system architecture, database schema, and launch sequence for your winner.'}
        </p>
      </div>
    );
  }

  if (state.step === 'DISCOVERY_RESULT') {
    return (
      <div className="h-full flex flex-col max-h-[85vh]">
        <div className="bg-slate-800 p-6 rounded-t-2xl border-b border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Analysis Complete
            </h2>
            <p className="text-slate-400 text-sm">Review the findings and confirm the winner.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900 scrollbar-thin">
          <MarkdownRenderer content={state.discoveryResult} />
        </div>

        <div className="bg-slate-800 p-6 rounded-b-2xl border-t border-slate-700 shrink-0">
          <div className="max-w-3xl mx-auto bg-slate-900 p-5 rounded-xl border border-slate-700 mb-4">
             <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">Confirm Winner for Phase 2</h3>
             <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-xs text-slate-500 mb-1">Winning Idea Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g., GDPR Compliance Bot"
                        value={state.selectedWinnerName}
                        onChange={(e) => setState(s => ({...s, selectedWinnerName: e.target.value}))}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">One-Line Pitch</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Auto-generates compliant responses for..."
                        value={state.selectedWinnerSummary}
                        onChange={(e) => setState(s => ({...s, selectedWinnerSummary: e.target.value}))}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
             </div>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={onCancel} className="text-slate-400 hover:text-white px-4">Save for Later</button>
            <button 
                disabled={!state.selectedWinnerName || !state.selectedWinnerSummary}
                onClick={handleGenerateSpec}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-indigo-900/20"
            >
                Generate Build Spec <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.step === 'SPEC_RESULT') {
    return (
      <div className="h-full flex flex-col max-h-[85vh]">
        <div className="bg-slate-800 p-6 rounded-t-2xl border-b border-slate-700 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-400" />
              Build Specification Ready
            </h2>
            <p className="text-slate-400 text-sm">Your blueprint for <b>{state.selectedWinnerName}</b> is ready.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          <MarkdownRenderer content={state.specResult} />
        </div>

        <div className="bg-slate-800 p-6 rounded-b-2xl border-t border-slate-700 flex justify-end shrink-0">
           <button 
             onClick={handleSaveAndFinish}
             className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-lg shadow-green-900/20"
           >
             <Save className="w-4 h-4" />
             Save to Register & Finish
           </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SessionWizard;
