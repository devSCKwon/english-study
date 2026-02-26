import React from 'react';
import { ArrowLeft, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryLog({ history, onBack }) {
    const getGradeStr = (ratio) => {
        if (ratio === 1) return { label: 'Perfect! 🌟', color: 'text-yellow-600 bg-yellow-100' };
        if (ratio >= 0.8) return { label: 'Excellent! 👏', color: 'text-green-600 bg-green-100' };
        if (ratio >= 0.5) return { label: 'Good Job! 👍', color: 'text-blue-600 bg-blue-100' };
        return { label: 'Keep Trying! 💪', color: 'text-orange-600 bg-orange-100' };
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 나가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <Award className="mr-3 text-purple-500" size={32} /> 내 학습 기록
                </h2>

                {history.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>아직 학습 기록이 없습니다.</p>
                        <p className="text-sm mt-2">지금 바로 단어 학습을 시작하고 기록을 남겨보세요!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((record, idx) => {
                            const grade = getGradeStr(record.ratio);
                            const date = new Date(record.date);
                            const timeStr = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-1">
                                            <Clock size={14} className="mr-1" /> {timeStr}
                                        </span>
                                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                            {record.correct} / {record.total} 정답
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            학습 방식: {record.methodLabel}
                                        </span>
                                    </div>
                                    <div className={`mt-3 sm:mt-0 px-4 py-2 rounded-xl font-bold ${grade.color}`}>
                                        {grade.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
