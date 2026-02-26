import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X, CheckCircle, RotateCcw } from 'lucide-react';

export default function ScoreModal({ isOpen, onClose, total, correct, onRetry, onHome }) {
    if (!isOpen) return null;

    const ratio = correct / total;
    let grade = '';
    let message = '';
    let color = '';

    if (ratio === 1) {
        grade = 'Perfect! 🌟';
        message = '완벽해요! 모든 단어를 다 맞혔어요!';
        color = 'text-yellow-500';
    } else if (ratio >= 0.8) {
        grade = 'Excellent! 👏';
        message = '아주 잘했어요! 거의 다 맞혔네요.';
        color = 'text-green-500';
    } else if (ratio >= 0.5) {
        grade = 'Good Job! 👍';
        message = '잘하고 있어요! 조금만 더 노력해볼까요?';
        color = 'text-blue-500';
    } else {
        grade = 'Keep Trying! 💪';
        message = '틀린 단어들을 다시 한번 복습해봐요!';
        color = 'text-orange-500';
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-2 border-gray-100 dark:border-gray-700"
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700">
                        <Trophy size={48} className={color} strokeWidth={1.5} />
                    </div>

                    <div className="text-center mt-8 mb-6">
                        <h2 className={`text-4xl font-black mb-2 ${color}`}>{grade}</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">{message}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8 flex justify-between items-center text-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">총 문제</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{total}개</p>
                        </div>
                        <div className="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">맞춘 문제</p>
                            <p className="text-3xl font-bold text-green-500">{correct}개</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onRetry}
                            className="w-full flex justify-center items-center py-4 rounded-xl font-bold text-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                            <RotateCcw className="mr-2" size={20} /> 한 번 더 하기
                        </button>
                        <button
                            onClick={onHome}
                            className="w-full flex justify-center items-center py-4 rounded-xl font-bold text-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                        >
                            <CheckCircle className="mr-2" size={20} /> 확인
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
