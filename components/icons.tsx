import React from 'react';

export const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M15 9a1 1 0 0 0-1-1H9a1 1 0 1 0 0 2h5a1 1 0 0 0 1-1Z" />
    <path
      fillRule="evenodd"
      d="M21 5.25A3.75 3.75 0 0 0 17.25 1.5h-9A3.75 3.75 0 0 0 4.5 5.25v9A3.75 3.75 0 0 0 8.25 18H9v2.25a.75.75 0 0 0 1.5 0V18h3v2.25a.75.75 0 0 0 1.5 0V18h.75A3.75 3.75 0 0 0 21 14.25v-9ZM16.5 6a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75H12v-1.5a.75.75 0 0 1 .75-.75h2.25V12a.75.75 0 0 1 1.5 0v1.5h.75a.75.75 0 0 0 .75-.75v-9Z"
      clipRule="evenodd"
    />
    <path d="M12.75 12.75a.75.75 0 0 0-1.5 0v1.5h1.5v-1.5Z" />
  </svg>
);

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 7.758a.75.75 0 0 0-1.06-1.06L3.515 8.29a.75.75 0 1 0 1.06 1.061l1.591-1.59Z" />
  </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 0 0-1.071 1.071l2.122 2.122a.75.75 0 0 0 1.07-1.071L12.963 2.286ZM10.93 4.286a.75.75 0 0 1 1.071 0l2.121 2.121a.75.75 0 0 1-1.07 1.071L10.93 5.357a.75.75 0 0 1 0-1.071ZM9.18 6.03a.75.75 0 0 0-1.07 1.071l2.12 2.121a.75.75 0 0 0 1.07-1.071L9.18 6.03ZM7.43 7.78a.75.75 0 0 1 1.07 0l2.121 2.121a.75.75 0 0 1-1.07 1.071L7.43 8.85a.75.75 0 0 1 0-1.07ZM5.68 9.53a.75.75 0 0 0-1.07 1.071l2.122 2.122a.75.75 0 0 0 1.07-1.071L5.68 9.53ZM15.75 9.75a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Zm3.375 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
    <path d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a.75.75 0 0 1-1.5 0v-3A6.75 6.75 0 0 1 12 0a6.75 6.75 0 0 1 6.75 6.75v3a.75.75 0 0 1-1.5 0v-3A5.25 5.25 0 0 0 12 1.5Z" />
    <path d="M12.75 18.75a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0v-2.25Z" />
    <path d="M16.5 20.25a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Z" />
    <path d="M9 20.25a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Z" />
  </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
    <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
  </svg>
);

export const WaveformIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 38 24" fill="none" className={className}>
    <g>
      <path d="M1 12L5 1V23L9 12L13 1V23L17 12L21 1V23L25 12L29 1V23L33 12L37 1V23L37 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="d" values="M1 12L5 1V23L9 12L13 1V23L17 12L21 1V23L25 12L29 1V23L33 12L37 1V23L37 12;M1 12L5 23V1L9 12L13 23V1L17 12L21 23V1L25 12L29 23V1L33 12L37 23V1L37 12;M1 12L5 1V23L9 12L13 1V23L17 12L21 1V23L25 12L29 1V23L33 12L37 1V23L37 12" dur="0.8s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
);

export const ConversationIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.026 3.348 3.97v6.02c0 1.944-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.75.75 0 0 0-.676.928A49.71 49.71 0 0 1 12 21.75c-2.676 0-5.216-.38-7.504-1.007a.75.75 0 0 1-.01-1.332A49.495 49.495 0 0 1 12 18c1.88 0 3.703.12 5.44.339.75.09 1.32-.513 1.32-1.258v-3.432c0-.745-.57-1.348-1.32-1.258A48.847 48.847 0 0 0 12 12.75a48.847 48.847 0 0 0-5.44-.339c-.75-.09-1.32.513-1.32 1.258v3.432c0 .745.57 1.348 1.32 1.258.95.113 1.9.198 2.829.25a.75.75 0 0 1 .622.842l-.217 1.256a.75.75 0 0 1-1.357.245 49.623 49.623 0 0 1-2.006-.523 3.38 3.38 0 0 1-2.582-3.34V6.74c0-1.944 1.37-3.678 3.348-3.97Z" clipRule="evenodd" />
</svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.5 3.75a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25h-6Zm.75 2.25a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75h-6Z" clipRule="evenodd" />
    <path d="M5.25 3.75a2.25 2.25 0 0 1 2.25-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 0-.75.75v10.5a.75.75 0 0 0 .75.75h.75a.75.75 0 0 1 0 1.5h-.75a2.25 2.25 0 0 1-2.25-2.25V3.75Z" />
  </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M15.75 18a3 3 0 1 1-5.18-1.751l-4.593-2.652a3.001 3.001 0 0 1 0-1.192l4.593-2.652a3 3 0 1 1 .531-1.002l-4.593 2.652a3 3 0 1 1 0 3.196l4.593 2.652A3 3 0 0 1 15.75 18Z" />
  </svg>
);