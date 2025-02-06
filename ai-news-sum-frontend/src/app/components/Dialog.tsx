import React from 'react';
import { X } from 'lucide-react';
import { DialogProps } from '../types';

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{article.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{article.site_name} • By {article.author}</p>
              {article.topic && (
                <p className="text-sm text-indigo-600 mt-1 capitalize">Topic: {article.topic}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap">{article.summary}</p>
          </div>
          
          <div className="mt-6 flex justify-end">
            <a
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Read full article →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;