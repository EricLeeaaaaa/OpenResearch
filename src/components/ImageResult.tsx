import { memo } from 'react';
import type { SearchResult } from '../types';
import { Image as ImageIcon } from 'lucide-react';

export const ImageResult = memo(function ImageResult({ result }: { result: SearchResult }) {
  return (
    <div className="group relative">
      <a
        href={result.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square overflow-hidden rounded-lg"
      >
        {result.imageUrl ? (
          <img
            src={result.imageUrl}
            alt={result.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1877F2] to-[#0C4A9E] flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-white/80" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white text-sm truncate">{result.title}</h3>
        </div>
      </a>
    </div>
  );
});