import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MethodManual({ onBack, onComplete }) {
    const [word, setWord] = useState('');

    const handleStart = (e) => {
        e.preventDefault();
        if (!word.trim()) return;

        const words = word.split(',').map(w => w.trim()).filter(w => w);
        if (words.length === 0) return;

        // 자주 사용되는 단어에 대한 미니 사전 (사전에 없는 단어를 위해 Fallback 구조 추가)
        const dictionary = {
            'apple': { pron: '[ˈæp.əl]', meaning: '사과', example: 'I eat an apple.', exampleMeaning: '나는 사과를 먹어요.' },
            'banana': { pron: '[bəˈnɑː.nə]', meaning: '바나나', example: 'Monkeys love bananas.', exampleMeaning: '원숭이는 바나나를 좋아해요.' },
            'cat': { pron: '[kæt]', meaning: '고양이', example: 'The cat is sleeping.', exampleMeaning: '고양이가 자고 있어요.' },
            'dog': { pron: '[dɔːɡ]', meaning: '개', example: 'My dog is smart.', exampleMeaning: '나의 개는 똑똑해요.' },
            'book': { pron: '[bʊk]', meaning: '책', example: 'I read a book.', exampleMeaning: '나는 책을 읽어요.' },
            'school': { pron: '[skuːl]', meaning: '학교', example: 'I go to school.', exampleMeaning: '나는 학교에 갑니다.' },
            'friend': { pron: '[frend]', meaning: '친구', example: 'He is my friend.', exampleMeaning: '그는 내 친구입니다.' },
            'water': { pron: '[ˈwɔː.tər]', meaning: '물', example: 'Drink some water.', exampleMeaning: '물을 마시세요.' },
            'happy': { pron: '[ˈhæp.i]', meaning: '행복한', example: 'I am very happy.', exampleMeaning: '나는 매우 행복합니다.' }
        };

        const data = words.map(w => {
            const lowerW = w.toLowerCase();
            if (dictionary[lowerW]) {
                return { word: w, ...dictionary[lowerW] };
            }
            // 사전에 없는 경우 동적으로 생성된 패턴 적용
            return {
                word: w,
                pron: `[${w} 발음 기호 미확인]`,
                meaning: `(사용자 지정 단어)`,
                example: `I am going to practice the word '${w}'.`,
                exampleMeaning: `나는 '${w}'라는 단어를 연습할 것입니다.`
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
