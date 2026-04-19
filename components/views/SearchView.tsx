'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, ExternalLink, BookmarkPlus, Loader2, Play, FileText, FileQuestion, Globe } from 'lucide-react';
import { useResources } from '@/lib/ResourceContext';

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

// Simple viewer modal for external pages
function IframeViewer({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col pt-10 px-4 pb-4 animate-in fade-in">
      <div className="bg-white rounded-t-2xl w-full max-w-6xl mx-auto flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2 px-2 overflow-hidden">
          <Globe size={18} className="text-gray-400 shrink-0" />
          <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
            <ExternalLink size={18} />
          </a>
          <button onClick={onClose} className="p-2 bg-black text-white hover:bg-gray-800 rounded-lg text-sm font-medium px-4 transition-colors">
            Close
          </button>
        </div>
      </div>
      <div className="bg-white w-full max-w-6xl mx-auto flex-1 rounded-b-2xl overflow-hidden shadow-2xl relative">
        <iframe 
          src={url} 
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Search Result Viewer"
        />
      </div>
    </div>
  );
}

export function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  const { saveLink, resources } = useResources();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      // Use the API route which uses duck-duck-scrape
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (activeFilter === 'All') return results;
    
    const kw = activeFilter.toLowerCase();
    return results.filter(r => {
      const txt = (r.title + ' ' + r.snippet + ' ' + r.url).toLowerCase();
      if (kw === 'notes') return txt.includes('note') || txt.includes('study') || txt.includes('summary');
      if (kw === 'pdfs') return txt.includes('.pdf') || txt.includes('pdf');
      if (kw === 'videos') return txt.includes('youtube') || txt.includes('video');
      if (kw === 'questions') return txt.includes('exam') || txt.includes('question') || txt.includes('quiz') || txt.includes('paper');
      return true;
    });
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quick Search</h1>
        <p className="text-gray-500 mt-1">Research topics and save important resources straight to your library.</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="E.g., class 10 thermodynamics notes pdf..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-0 text-lg bg-transparent outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['All', 'Notes', 'PDFs', 'Videos', 'Questions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab 
                ? 'bg-black text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="py-20 flex justify-center text-gray-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {!loading && hasSearched && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Showing results {activeFilter !== 'All' ? `for ${activeFilter}` : ''} ({filteredResults.length})</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((result, i) => {
              const isSaved = resources.some(r => r.type === 'link' && r.url === result.url);
              
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full group hover:border-gray-300 transition-colors">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-mono flex items-center gap-1 mb-2 truncate">
                      {result.url.includes('youtube.com') ? <Play size={12} className="text-red-500" /> : 
                       result.url.includes('.pdf') ? <FileText size={12} className="text-orange-500" /> :
                       <Globe size={12} />
                      }
                      {result.url}
                    </p>
                    <h3 className="font-semibold text-lg leading-snug mb-2 line-clamp-2">
                       <button onClick={() => setViewUrl(result.url)} className="hover:text-blue-600 hover:underline text-left transition-colors">
                         {result.title}
                       </button>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{result.snippet}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                    <button 
                      onClick={() => setViewUrl(result.url)}
                      className="text-sm font-medium text-black hover:underline flex items-center gap-1"
                    >
                      Open Document
                    </button>
                    {!isSaved ? (
                      <button 
                        onClick={() => saveLink({ title: result.title, url: result.url, snippet: result.snippet })}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                      >
                        <BookmarkPlus size={16} /> Save
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        Saved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredResults.length === 0 && (
            <div className="py-20 text-center text-gray-500">
               <FileQuestion size={40} className="mx-auto text-gray-300 mb-3" />
               <p className="font-medium">No resources found</p>
               <p className="text-sm mt-1">Try adapting your search or changing the tab filter.</p>
            </div>
          )}
        </div>
      )}

      {viewUrl && (
        <IframeViewer url={viewUrl} onClose={() => setViewUrl(null)} />
      )}
    </div>
  );
}
