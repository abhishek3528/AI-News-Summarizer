"use client"
import React, { useState, useEffect } from 'react';
import { Newspaper, BookmarkPlus, TrendingUp } from 'lucide-react';
import NewsCard from './components/NewsCard';
import SearchBar from './components/SearchBar';
import Dialog from './components/Dialog';
import { Article } from './types';

function App() {
  const [searchTopic, setSearchTopic] = useState('');
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      setSavedArticles(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const handleSearch = async (topic: string) => {
    setSearchTopic(topic);
    setIsLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const article: Article = await response.json();
      setNewArticle(article);
      setSelectedArticle(article);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching article:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching the article';
      setNewArticle(null);
      setSelectedArticle(null);
      setIsDialogOpen(false);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg shadow-xl z-50 text-lg min-w-[300px] text-center';
      errorDiv.textContent = errorMessage;
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        errorDiv.remove();
      }, 5000);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    if (newArticle) {
      setRecentArticles(prev => [newArticle, ...prev].slice(0, 6));
      setNewArticle(null);
    }
  };

  const handleSaveArticle = (article: Article) => {
    if (!savedArticles.some(saved => saved.title === article.title)) {
      setSavedArticles(prev => [article, ...prev]);
    }
  };

  const handleRemoveArticle = (articleId: string) => {
    setSavedArticles(prev => prev.filter(article => article.title !== articleId));
  };

  const handleCardClick = (article: Article) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">NewsAI Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Display the current search topic */}
        <h2 className="text-xl hidden">Current Search Topic: {searchTopic}</h2>

        {/* Recently Searched Articles Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Recently Searched Articles</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <NewsCard 
                key={article.title} 
                article={article}
                onSave={() => handleSaveArticle(article)}
                onCardClick={() => handleCardClick(article)}
                showSaveButton={true}
                isSaved={savedArticles.some(saved => saved.title === article.title)}
              />
            ))}
            {recentArticles.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">Search for topics to see recent articles</p>
              </div>
            )}
          </div>
        </section>

        {/* Saved Articles Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <BookmarkPlus className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Articles</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedArticles.map((article) => (
              <NewsCard 
                key={article.title} 
                article={article}
                showSaveButton={false}
                onCardClick={() => handleCardClick(article)}
                onRemove={() => handleRemoveArticle(article.title)}
                isSaved={true}
              />
            ))}
            {savedArticles.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No saved articles yet</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        article={selectedArticle}
      />
    </div>
  );
}

export default App;