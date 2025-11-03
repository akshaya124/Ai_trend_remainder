import React, { useState, useCallback } from 'react';
import { fetchAITrends } from './services/geminiService';
import { AITrendUpdate } from './types';
import TrendCard from './components/TrendCard';
import LoadingSpinner from './components/LoadingSpinner';
import Conversation from './components/Conversation';
import { RobotIcon, LightbulbIcon, RocketIcon, ConversationIcon } from './components/icons';

type View = 'trends' | 'conversation';

const App: React.FC = () => {
  const [updateData, setUpdateData] = useState<AITrendUpdate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('trends');

  const handleFetchUpdate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUpdateData(null);
    try {
      const data = await fetchAITrends();
      setUpdateData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const resetToHome = () => {
    setView('trends');
    setUpdateData(null);
    setError(null);
  }

  const handleStartConversation = async () => {
    setError(null);
    // Use window.aistudio to ensure API key is selected before proceeding,
    // as required for advanced models.
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
      // After openSelectKey, assume the key is selected (handles race conditions).
      setView('conversation');
    } catch (e) {
      console.error('API key selection error:', e);
      setError('An API key must be selected to use the conversation feature.');
    }
  };


  const InitialState = () => (
    <div className="text-center flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
        Your Personal AI Trend Guide
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Stay ahead of the curve. Get your daily briefing on AI trends, or have a live chat with your AI guide.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleFetchUpdate}
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          <span className="relative flex items-center gap-2">
            Get Today's Update
            <RobotIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          </span>
        </button>
        <button
          onClick={handleStartConversation}
          className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-gray-600"
        >
           <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          <span className="relative flex items-center gap-2">
            Chat with Aryaa
            <ConversationIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          </span>
        </button>
      </div>
    </div>
  );

  const TrendsDisplay = () => (
    updateData && (
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            {updateData.greeting}
          </h2>
        </header>
        
        <main className="space-y-6">
          {updateData.trends.map((trend, index) => (
            <TrendCard key={index} trend={trend} index={index} />
          ))}
        </main>

        <footer className="text-center mt-12">
          <p className="text-lg text-gray-600 flex items-center justify-center gap-3">
            {updateData.closing}
            <LightbulbIcon className="w-6 h-6 text-yellow-400" />
            <RocketIcon className="w-6 h-6 text-red-500" />
          </p>
           <button
            onClick={handleFetchUpdate}
            disabled={isLoading}
            className="mt-6 text-blue-500 hover:text-blue-400 transition-colors"
           >
             Refresh Trends
           </button>
        </footer>
      </div>
    )
  );
  
  const TrendsView = () => (
    <>
      {!isLoading && !updateData && !error && <InitialState />}
      {isLoading && <LoadingSpinner />}
      {error && (
        <div className="text-center p-8 bg-red-100 border border-red-300 rounded-lg">
          <h3 className="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong.</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={view === 'trends' ? handleFetchUpdate : handleStartConversation}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      {!isLoading && updateData && <TrendsDisplay />}
    </>
  )

  return (
    <div className="min-h-screen text-gray-800 font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.05] z-0"></div>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {view === 'trends' ? <TrendsView /> : <Conversation onBack={resetToHome} />}
      </div>
       <style>{`
          .animate-fade-in {
            animation: fadeIn 0.8s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .bg-grid-gray-700\\[\\[0\\.05\\]] {
            background-image: linear-gradient(to right, rgba(107, 114, 128, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(107, 114, 128, 0.05) 1px, transparent 1px);
            background-size: 3rem 3rem;
          }
      `}</style>
    </div>
  );
};

export default App;