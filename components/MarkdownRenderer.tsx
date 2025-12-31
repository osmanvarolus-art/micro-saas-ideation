import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-indigo-300 mt-6 mb-4 border-b border-slate-700 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-medium text-indigo-200 mt-4 mb-2" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-3 text-slate-300" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-3 text-slate-300" {...props} />,
          li: ({node, ...props}) => <li className="ml-2" {...props} />,
          strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-slate-700"><table className="w-full text-left" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-slate-800 text-slate-200" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-2 font-semibold border-b border-slate-700" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-2 border-b border-slate-800" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-slate-800/50 rounded-r italic" {...props} />,
          code: ({node, ...props}) => {
             // Extract 'inline' properly from props or checking children
             // However, types for react-markdown components can be tricky. 
             // Simplification: assume block if it has newlines or is parented by pre
             const isInline = typeof props.children === 'string' && !props.children.includes('\n');
             return isInline 
                ? <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs" {...props} />
                : <code className="block bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800 my-3" {...props} />
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
