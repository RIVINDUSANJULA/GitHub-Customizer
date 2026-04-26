"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { Search, Zap, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SearchSyncBar() {
  const store = useBuilderStore();
  const [inputValue, setInputValue] = useState(store.username || "");
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    if (!inputValue.trim()) return;
    
    setIsSyncing(true);
    setError(null);
    store.setUsername(inputValue);
    
    try {
      const res = await fetch(`/api/github-user-data?username=${inputValue}&forceRefresh=true`);
      if (!res.ok) {
        const text = await res.text();
        if (text === "USER_TRACE_FAILED") throw new Error("USER_TRACE_FAILED");
        throw new Error("API_DOWN");
      }
      
      const data = await res.json();
      if (data.languages) store.setAutoLanguages(data.languages);
      if (data.skills) store.setAutoSkills(data.skills);
      
      // Successfully synced
      store.setRefreshTrigger(store.refreshTrigger + 1);
    } catch (err: any) {
      console.error("Sync Error:", err);
      setError(err.message === "USER_TRACE_FAILED" ? "Trace Failed: User not found" : "API Down: Try again later");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-3 flex flex-col gap-2 relative z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">GitInfo Titan</h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">GraphQL Global Aggregator</p>
          </div>
        </div>

        <div className="flex-1 max-w-md relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSync()}
            placeholder="Search any GitHub handle..."
            className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500/50 rounded-xl text-sm transition-all focus:ring-4 focus:ring-indigo-500/10 outline-none"
          />
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSyncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            Sync
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">GraphQL Active</span>
            <span className="text-[8px] font-mono text-slate-500">5,000 req/hr capacity</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-7xl mx-auto w-full"
          >
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-rose-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
              </div>
              <button 
                onClick={handleSync}
                className="text-[10px] font-black uppercase text-rose-500 hover:underline"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
