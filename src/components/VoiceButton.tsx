import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, onClick, disabled }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        transition-all duration-300 transform
        ${isListening
          ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-2xl'
          : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        focus:outline-none focus:ring-4 focus:ring-blue-300
      `}
    >
      {isListening ? (
        <MicOff className="w-10 h-10 text-white" />
      ) : (
        <Mic className="w-10 h-10 text-white" />
      )}

      {isListening && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
      )}
    </button>
  );
}
