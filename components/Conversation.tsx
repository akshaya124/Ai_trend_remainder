import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Removed 'LiveSession' as it is not an exported member of '@google/genai'.
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import { MicrophoneIcon, StopIcon } from './icons';

interface ConversationProps {
  onBack: () => void;
}

type Status = 'idle' | 'connecting' | 'listening' | 'error';
type TranscriptEntry = {
  speaker: 'You' | 'Aryaa';
  text: string;
};

const Conversation: React.FC<ConversationProps> = ({ onBack }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [liveOutput, setLiveOutput] = useState('');

  // FIX: Changed 'LiveSession' to 'any' as the type is not exported from the library.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [transcript, liveInput, liveOutput]);

  const drawVisualizer = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = 48; 

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);
        
        canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 4;
            
            canvasCtx!.fillStyle = `rgba(59, 130, 246, ${barHeight / 100 + 0.1})`;
            canvasCtx!.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }
    };

    draw();
  }, []);
  
  const stopConversation = useCallback(async () => {
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
    }

    if (canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
    }
      
    if (sessionPromiseRef.current) {
        const session = await sessionPromiseRef.current.catch(() => null);
        session?.close();
        sessionPromiseRef.current = null;
    }

    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current?.disconnect();
    mediaStreamSourceRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    
    await inputAudioContextRef.current?.close();
    inputAudioContextRef.current = null;
    await outputAudioContextRef.current?.close();
    outputAudioContextRef.current = null;

    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    
    setStatus('idle');
    setLiveInput('');
    setLiveOutput('');
  }, []);
  
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, [stopConversation]);

  const startConversation = useCallback(async () => {
    setStatus('connecting');
    setError(null);
    setTranscript([]);
    setLiveInput('');
    setLiveOutput('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // FIX: Cast window to `any` to allow `webkitAudioContext` for cross-browser compatibility.
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      // FIX: Cast window to `any` to allow `webkitAudioContext` for cross-browser compatibility.
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are Aryaa, a friendly and helpful AI Trend Guide. Detect the user\'s language and respond fluently in that same language. Keep your responses concise and conversational.',
        },
        callbacks: {
          onopen: () => {
            const inputAudioContext = inputAudioContextRef.current!;
            const source = inputAudioContext.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;
            
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            const analyser = inputAudioContext.createAnalyser();
            analyser.fftSize = 128;
            analyserRef.current = analyser;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
            
            setStatus('listening');
            drawVisualizer();
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
              setLiveInput(currentInputTranscriptionRef.current);
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
              setLiveOutput(currentOutputTranscriptionRef.current);
            }

            if (message.serverContent?.turnComplete) {
                const finalInput = currentInputTranscriptionRef.current.trim();
                const finalOutput = currentOutputTranscriptionRef.current.trim();
                setTranscript(prev => {
                    const newTranscript = [...prev];
                    if (finalInput) newTranscript.push({ speaker: 'You', text: finalInput });
                    if (finalOutput) newTranscript.push({ speaker: 'Aryaa', text: finalOutput });
                    return newTranscript;
                });
                currentInputTranscriptionRef.current = '';
                currentOutputTranscriptionRef.current = '';
                setLiveInput('');
                setLiveOutput('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.addEventListener('ended', () => {
                audioSourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioSourcesRef.current.add(source);
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setError('A network error occurred. This might be due to a connection issue or an invalid API key. Please try again.');
            setStatus('error');
            stopConversation();
          },
          onclose: () => {
            // Handled by user action or error
          },
        },
      });

    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else {
        setError('Failed to start the conversation. Please check your microphone and try again.');
      }
      setStatus('error');
    }
  }, [stopConversation, drawVisualizer]);

  const getStatusMessage = () => {
    switch (status) {
      case 'idle': return 'Click the microphone to start talking';
      case 'connecting': return 'Connecting to Aryaa...';
      case 'listening': return 'Listening...';
      case 'error': return 'Something went wrong';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg flex flex-col animate-fade-in">
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Conversation with Aryaa</h2>
            <button onClick={onBack} className="text-gray-500 hover:text-gray-900 transition-colors">&times; Close</button>
        </header>

        <main className="flex-grow p-4 overflow-y-auto space-y-4">
            {transcript.map((entry, index) => (
                <div key={index} className={`flex items-end gap-2 ${entry.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                    {entry.speaker === 'Aryaa' && <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold flex-shrink-0 text-white">A</div>}
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${entry.speaker === 'You' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                        <p className="whitespace-pre-wrap">{entry.text}</p>
                    </div>
                </div>
            ))}
            {liveInput && (
                <div className="flex items-end gap-2 justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-blue-600/70 text-white rounded-br-none">
                        <p className="whitespace-pre-wrap">{liveInput}</p>
                    </div>
                </div>
            )}
            {liveOutput && (
                <div className="flex items-end gap-2 justify-start">
                    {<div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold flex-shrink-0 text-white">A</div>}
                    <div className="px-4 py-2 rounded-2xl max-w-[80%] bg-gray-200/70 text-gray-800 rounded-bl-none">
                        <p className="whitespace-pre-wrap">{liveOutput}</p>
                    </div>
                </div>
            )}
             <div ref={transcriptEndRef} />
        </main>

        <footer className="p-4 border-t border-gray-200 flex flex-col items-center justify-center gap-3">
             <div className="w-full h-12">
                {status === 'listening' && <canvas ref={canvasRef} className="w-full h-full"></canvas>}
             </div>
             
             {status === 'error' ? (
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                     <button onClick={startConversation} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-semibold transition-colors">
                        Try Again
                    </button>
                </div>
             ) : (
                <>
                    <button
                        onClick={status === 'listening' ? stopConversation : startConversation}
                        disabled={status === 'connecting'}
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 enabled:hover:scale-110"
                        style={{ background: status === 'listening' ? '#ef4444' : '#2563eb' }}
                        aria-label={status === 'listening' ? 'Stop conversation' : 'Start conversation'}
                    >
                        {status === 'listening' ? <StopIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-8 h-8 text-white" />}
                    </button>
                    <p className="text-gray-600 text-sm h-5">{getStatusMessage()}</p>
                </>
            )}
        </footer>
    </div>
  );
};

export default Conversation;