import React, { useState } from 'react';
import { Trend } from '../types';
import { CopyIcon, ShareIcon } from './icons';

interface TrendCardProps {
  trend: Trend;
  index: number;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, index }) => {
  const emojis = ['1️⃣', '2️⃣', '3️⃣'];
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `
Trend: ${trend.title}

What’s happening:
${trend.happening}

Why it matters:
${trend.matters}

How to act:
${trend.action.strategy}
Learn more: ${trend.action.text} (${trend.action.link})
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy trend: ', err);
    });
  };
  
  const handleShare = async () => {
    const shareData = {
      title: `AI Trend: ${trend.title}`,
      text: `Check out this AI trend: ${trend.title}\n\n${trend.happening}\n\nRead more here:`,
      url: trend.action.link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard if Web Share API is not available
      const fallbackText = `${shareData.title}\n\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(fallbackText).then(() => {
        alert('Sharing not supported on this browser. Trend info copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy trend for sharing: ', err);
      });
    }
  };


  return (
    <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-blue-500/10 overflow-hidden">
      <img
        src={trend.imageUrl}
        alt={`Visual representation for ${trend.title}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="p-6 relative">
        <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100/50 text-gray-500 hover:bg-gray-200/70 hover:text-gray-900 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Share Trend"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center px-3 py-2 w-[88px] h-10 rounded-lg bg-gray-100/50 text-gray-500 hover:bg-gray-200/70 hover:text-gray-900 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Copy Trend Summary"
            >
              {isCopied ? (
                <span className="text-sm font-semibold text-green-600">Copied!</span>
              ) : (
                <CopyIcon className="w-5 h-5" />
              )}
            </button>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 pr-36">
          <span className="mr-3">{emojis[index]}</span>
          {trend.title}
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-600 mb-1">What’s happening:</h4>
            <p className="text-gray-700">{trend.happening}</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-1">Why it matters:</h4>
            <p className="text-gray-700">{trend.matters}</p>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-2">How to act:</h4>
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{trend.action.strategy}</p>
            <a
              href={trend.action.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-500 underline transition-colors duration-200 break-words font-medium"
            >
              {trend.action.text}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendCard;