"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { generateMarkdown } from "@/lib/markdown-generator";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BuilderPreview() {
  const store = useBuilderStore();
  const markdown = generateMarkdown(store);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-zinc-950/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-950 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'preview' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'code' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
          >
            Code
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 md:p-10">
        <div className="max-w-4xl mx-auto w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          {activeTab === 'preview' ? (
            <div className="p-8 prose dark:prose-invert max-w-none">
              {store.username ? (
                <div 
                  className="preview-markdown flex flex-col gap-4"
                  dangerouslySetInnerHTML={{ __html: markdown.replace(/\n/g, '<br/>') }} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                  <p>Enter your GitHub username to see the preview.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-0 h-full">
              <pre className="p-6 text-sm text-slate-800 dark:text-slate-300 overflow-x-auto font-mono whitespace-pre-wrap">
                {markdown}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .preview-markdown img { 
          max-width: 100%; 
          height: auto; 
          display: inline-block; 
          margin: 4px; 
          border-radius: 8px;
          min-height: 50px;
          background: rgba(0,0,0,0.05);
          transition: opacity 0.3s ease;
        }
        .dark .preview-markdown img {
          background: rgba(255,255,255,0.05);
        }
        .preview-markdown div[align="center"] { 
          display: flex; 
          flex-wrap: wrap; 
          justify-content: center; 
          gap: 8px; 
        }
      `}} />
    </div>
  );
}
