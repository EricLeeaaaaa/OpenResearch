import React, { useRef, useState } from 'react';
import type { SearchSource, SearchResult } from './types';
import { searchSerper, generateAIResponse } from './services/api';
import { SearchBar } from './components/SearchBar';
import { SourceSelector } from './components/SourceSelector';
import { SearchResults } from './components/SearchResults';
import { AIResponse } from './components/AIResponse';
import { Globe, Github, Settings } from 'lucide-react';
import { SettingsDialog } from './components/SettingsDialog';

export function App() {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SearchSource>('search');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSettings, setOpenSettings] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  const handleSourceChange = (newSource: SearchSource) => {
    // Abort any in-flight requests when source changes
    controllerRef.current?.abort();
    controllerRef.current = null;

    setSource(newSource);
    setResults([]);
    setAIResponse('');
    setError('');
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Abort previous request to prevent race conditions
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError('');
    setAIResponse('');
    setResults([]);

    try {
      const searchResults = await searchSerper(query, source, { signal: controller.signal });
      setResults(searchResults);

      const response = await generateAIResponse(query, searchResults, source, {
        signal: controller.signal,
      });
      setAIResponse(response);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // Silently ignore aborted requests
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F0F2F5] to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-3">
              <Globe className="w-10 h-10 text-[#1877F2]" />
              <h1 className="text-4xl font-bold text-[#1877F2]">OpenResearch.ai</h1>
            </div>
            <button
              onClick={() => setOpenSettings(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              title="设置 API Key"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">设置</span>
            </button>
          </div>

          <div className="max-w-3xl mx-auto mt-6">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              isLoading={loading}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          <SourceSelector selectedSource={source} onSourceChange={handleSourceChange} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2]"></div>
            </div>
          )}

          <div className="space-y-6">
            {aiResponse && !loading && <AIResponse response={aiResponse} />}

            {results.length > 0 && !loading && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
                <SearchResults results={results} source={source} />
              </>
            )}

            {!loading && !results.length && !error && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Enter your search query to discover knowledge across the internet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">
              OpenResearch.ai - Advanced AI-powered research assistant
            </p>
            <a
              href="https://github.com/Justmalhar/OpenResearch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1877F2] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </div>
  );
}