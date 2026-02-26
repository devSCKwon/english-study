import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MethodGrade({ onBack, onComplete }) {
    const [grade, setGrade] = useState(1);

    const handleStart = () => {
        // Mock Data based on grade
        const mockData = grade <= 3 ? [
            { word: 'Cat', pron: '[kæt]', meaning: '고양이', example: 'A cute cat is sleeping.', exampleMeaning: '귀여운 고양이가 자고 있어요.' },
            { word: 'Dog', pron: '[dɔːɡ]', meaning: '개, 강아지', example: 'The dog says woof.', exampleMeaning: '그 개가 멍멍 하고 짖어요.' },
            { word: 'House', pron: '[haʊs]', meaning: '집', example: 'My house is big.', exampleMeaning: '나의 집은 큽니다.' },
        ] : [
            { word: 'Beautiful', pron: '[ˈbjuː.tɪ.fəl]', meaning: '아름다운', example: 'The flower is beautiful.', exampleMeaning: '그 꽃은 아름답습니다.' },
            { word: 'Universe', pron: '[ˈjuː.nɪ.vɜːs]', meaning: '우주', example: 'The universe is vast.', exampleMeaning: '우주는 광활합니다.' },
            { word: 'Experience', pron: '[ɪkˈspɪə.ri.əns]', meaning: '경험', example: 'It was a great experience.', exampleMeaning: '그것은 멋진 경험이었습니다.' },
        ];
        onComplete(mockData);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">학년별 단어장</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3, 4, 5, 6].map(g => (
                        <button
                            key={g}
                            onClick={() => setGrade(g)}
                            className={`py-4 rounded-2xl border-2 text-lg font-bold transition-all ${grade === g ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-gray-200 text-gray-600 hover:border-green-300 dark:border-gray-700 dark:text-gray-400'}`}
                        >
                            {g}학년
                        </button>
                    ))}
                </div>
                <div className="text-center">
                    <button
                        onClick={handleStart}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg flex items-center mx-auto"
                    >
                        <BookOpen size={20} className="mr-2" /> {grade}학년 기초단어 학습 시작
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
