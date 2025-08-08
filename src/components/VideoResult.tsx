import { memo } from 'react';
import type { SearchResult } from '../types';
import { Play, Eye, User, Video as VideoIcon } from 'lucide-react';

export const VideoResult = memo(function VideoResult({ result }: { result: SearchResult }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <a href={result.link} target="_blank" rel="noopener noreferrer" className="block flex-grow">
        <div className="relative aspect-video">
          {result.thumbnail ? (
            <img
              src={result.thumbnail}
              alt={result.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1877F2] to-[#0C4A9E] flex items-center justify-center">
              <VideoIcon className="w-12 h-12 text-white/80" />
            </div>
          )}
          {result.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded-md flex items-center gap-1">
              <Play className="w-3 h-3" />
              {result.duration}
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#1877F2]">
            {result.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {result.channel && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span className="truncate">{result.channel}</span>
              </span>
            )}
            {result.views && (
              <span className="flex items-center gap-1 shrink-0">
                <Eye className="w-4 h-4" />
                {result.views}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
});
