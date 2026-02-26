import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioButton({ text, isSpeakingDisabled, className = '' }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if (isSpeakingDisabled || !window.speechSynthesis) return;

        // 이전에 재생중이던 음성은 취소합니다.
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // 약간 천천히 명확하게

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            disabled={isSpeakingDisabled}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${isPlaying
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            aria-label={`Play audio for ${text}`}
        >
            {isSpeakingDisabled ? <VolumeX size={20} /> : <Volume2 size={20} className={isPlaying ? 'animate-pulse' : ''} />}
        </motion.button>
    );
}
