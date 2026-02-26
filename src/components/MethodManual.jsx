import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { dictionary } from '../data/dictionary';

export default function MethodManual({ onBack, onComplete }) {
    const [word, setWord] = useState('');

    const handleStart = (e) => {
        e.preventDefault();
        if (!word.trim()) return;

        const words = word.split(',').map(w => w.trim()).filter(w => w);
        if (words.length === 0) return;

        const data = words.map(w => {
            const lowerW = w.toLowerCase();
            if (dictionary[lowerW]) {
                return { word: w, ...dictionary[lowerW] };
            }
            // 사전에 없는 경우 동적으로 생성된 패턴 적용
            return {
                word: w,
                pron: `[발음 미확인]`,
                meaning: `(새로운 단어)`,
                example: `Let's practice the word '${w}'.`,
                exampleMeaning: `'${w}' 단어를 함께 연습해봐요.`
            };
        });

        onComplete(data);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">직접 단어 입력</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">궁금한 영어 단어들을 쉼표(,)로 구분해서 입력해봐요!</p>
                <form onSubmit={handleStart} className="max-w-md mx-auto relative flex items-center">
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="예: apple, banana, cat"
                        className="w-full px-6 py-4 text-lg rounded-full border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white outline-none transition-all pr-16"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 flex flex-col items-center justify-center transition-colors"
                    >
                        <Search size={22} strokeWidth={3} />
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
