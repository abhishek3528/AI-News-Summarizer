import React from 'react';
import { BookmarkPlus, ExternalLink, Trash2 } from 'lucide-react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  showSaveButton?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
  onCardClick: () => void;
  isSaved?: boolean;
}

// const NewsCard: React.FC<NewsCardProps> = ({ 
//   article, 
//   showSaveButton = true, 
//   onSave,
//   onRemove,
//   onCardClick,
//   isSaved = false
// }) => {
//   const getSentimentColor = (sentiment: string) => {
//     switch (sentiment.toLowerCase()) {
//       case 'positive':
//         return 'bg-green-100 text-green-800';
//       case 'negative':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const truncateSummary = (text: string, maxLength: number = 150) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + '...';
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-sm text-gray-500">{article.site_name}</span>
//         </div>
        
//         <h3 className="text-xl font-semibold text-gray-900 mb-3 cursor-pointer hover:text-indigo-600" 
//             onClick={onCardClick}>
//           {article.title}
//         </h3>
        
//         <div className="cursor-pointer" onClick={onCardClick}>
//           <p className="text-gray-600 mb-2">
//             {truncateSummary(article.summary)}
//           </p>
//           <span className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
//             Read More
//           </span>
//         </div>
//         <div className=''>
//             <span className="text-sm text-gray-500 italic">By {article.author}</span>
//         </div>
        
//         <div className="flex items-center space-x-4 mb-4 mt-4">
//           <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
//             {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
//           </span>
//           {article.topic && (
//             <span className="text-sm text-indigo-600 capitalize">Topic: {article.topic}</span>
//           )}
//         </div>
        
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <div className="flex space-x-3">
//             {showSaveButton && !isSaved && (
//               <button 
//                 onClick={onSave}
//                 className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600"
//               >
//                 <BookmarkPlus className="h-5 w-5" />
//                 <span className="text-sm">Save</span>
//               </button>
//             )}
//             {isSaved && onRemove && (
//               <button 
//                 onClick={onRemove}
//                 className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
//               >
//                 <Trash2 className="h-5 w-5" />
//                 <span className="text-sm">Remove</span>
//               </button>
//             )}
//           </div>
          
//           <a
//             href={article.original_url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
//           >
//             <span className="text-sm">Read full article</span>
//             <ExternalLink className="h-4 w-4" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsCard;
const NewsCard: React.FC<NewsCardProps> = ({ 
  article, 
  showSaveButton = true, 
  onSave,
  onRemove,
  onCardClick,
  isSaved = false
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateSummary = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Card Content (Expands) */}
      <div className="p-6 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{article.site_name}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 cursor-pointer hover:text-indigo-600" 
            onClick={onCardClick}>
          {article.title}
        </h3>

        <div className="cursor-pointer" onClick={onCardClick}>
          <p className="text-gray-600 mb-2">
            {truncateSummary(article.summary)}
          </p>
          <span className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Read More
          </span>
        </div>

        <div className=''>
          <span className="text-sm text-gray-500 italic">By {article.author}</span>
        </div>

        <div className="flex items-center space-x-4 mb-4 mt-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(article.sentiment)}`}>
            {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
          </span>
          {article.topic && (
            <span className="text-sm text-indigo-600 capitalize">Topic: {article.topic}</span>
          )}
        </div>
      </div>

      {/* Fixed Footer (Keeps Save/Remove and Read full article aligned) */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-between">
        <div className="flex space-x-3">
          {showSaveButton && !isSaved && (
            <button 
              onClick={onSave}
              className="text-gray-500 hover:text-indigo-600 flex items-center space-x-1"
            >
              <BookmarkPlus className="h-5 w-5" />
              <span className="text-sm">Save</span>
            </button>
          )}
          {isSaved && onRemove && (
            <button 
              onClick={onRemove}
              className="text-gray-500 hover:text-red-600 flex items-center space-x-1"
            >
              <Trash2 className="h-5 w-5" />
              <span className="text-sm">Remove</span>
            </button>
          )}
        </div>

        <a href={article.original_url} target="_blank" rel="noopener noreferrer"
           className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
          <span className="text-sm">Read full article</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
