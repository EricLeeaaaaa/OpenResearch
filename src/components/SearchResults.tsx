import { memo, useMemo } from 'react';
import type { SearchResult, SearchSource } from '../types';
import { WebResult } from './WebResult';
import { ImageResult } from './ImageResult';
import { VideoResult } from './VideoResult';
import { PlaceResult } from './PlaceResult';
import { NewsResult } from './NewsResult';
import { ShoppingResult } from './ShoppingResult';
import { ScholarResult } from './ScholarResult';

interface SearchResultsProps {
  results: SearchResult[];
  source: SearchSource;
}

export const SearchResults = memo(function SearchResults({ results, source }: SearchResultsProps) {
  const ComponentBySource: Record<SearchSource, (props: { result: SearchResult }) => JSX.Element> = {
    search: ({ result }) => <WebResult result={result} />,
    images: ({ result }) => <ImageResult result={result} />,
    videos: ({ result }) => <VideoResult result={result} />,
    places: ({ result }) => <PlaceResult result={result} />,
    news: ({ result }) => <NewsResult result={result} />,
    shopping: ({ result }) => <ShoppingResult result={result} />,
    scholar: ({ result }) => <ScholarResult result={result} />,
    patents: ({ result }) => <ScholarResult result={result} />,
  };

  const gridClass = useMemo(() => {
    switch (source) {
      case 'images':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
      case 'videos':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8';
      case 'shopping':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1';
    }
  }, [source]);

  const Item = ComponentBySource[source];

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {results.map((result, index) => (
        <div key={`${result.link}-${index}`} className="h-full">
          <Item result={result} />
        </div>
      ))}
    </div>
  );
});
