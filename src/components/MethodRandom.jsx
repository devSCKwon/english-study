import React, { useState } from 'react';
import { ArrowLeft, Dices, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MethodRandom({ onBack, onComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleDraw = () => {
        setIsSpinning(true);
        // 1초 뒤에 랜덤 결과 보여주기
        setTimeout(() => {
            setIsSpinning(false);
            onComplete([
                { word: 'Magic', pron: '[ˈmædʒ.ɪk]', meaning: '마법', example: 'It was a magic show!', exampleMeaning: '그것은 마법 쇼였어요!' },
                { word: 'Adventure', pron: '[ədˈven.tʃər]', meaning: '모험', example: 'We went on a big adventure.', exampleMeaning: '우리는 큰 모험을 떠났어요.' },
                { word: 'Treasure', pron: '[ˈtreʒ.ər]', meaning: '보물', example: 'They found the hidden treasure.', exampleMeaning: '그들은 숨겨진 보물을 찾았습니다.' },
            ]);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">오늘의 뽑기!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-10">행운의 단어를 뽑아볼까요?</p>

                <div className="relative w-64 h-64 mx-auto mb-10 flex items-center justify-center">
                    <AnimatePresence>
                        {isSpinning && (
                            <motion.div
                                key="spinner"
                                className="absolute inset-0 border-8 border-pink-200 border-t-pink-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            />
                        )}
                    </AnimatePresence>
                    <div className="bg-pink-100 dark:bg-pink-900/50 p-10 rounded-full relative z-10 transition-transform hover:scale-105">
                        <Dices size={80} className={`text-pink-500 ${isSpinning ? 'animate-bounce' : ''}`} />
                    </div>
                </div>

                <button
                    onClick={handleDraw}
                    disabled={isSpinning}
                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-extrabold py-4 px-10 rounded-full text-2xl shadow-lg transition-colors flex items-center mx-auto"
                >
                    <Sparkles className="mr-3" />
                    {isSpinning ? '가져오는 중...' : '단어 뽑기!'}
                </button>
            </div>
        </motion.div>
    );
}
