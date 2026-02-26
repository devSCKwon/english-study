import React, { useState } from 'react';
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MethodImage({ onBack, onComplete }) {
    const [file, setFile] = useState(null);

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleStart = () => {
        if (!file) return;
        setIsAnalyzing(true);
        // 모의 OCR 지연 시간 (1.5초) 후 결과 추출
        setTimeout(() => {
            setIsAnalyzing(false);
            onComplete([
                { word: 'Examination', pron: '[ɪɡˌzæm.ɪˈneɪ.ʃən]', meaning: '시험', example: 'The examination was very difficult.', exampleMeaning: '그 시험은 매우 어려웠습니다.' },
                { word: 'Question', pron: '[ˈkwes.tʃən]', meaning: '질문, 문제', example: 'Please answer the next question.', exampleMeaning: '다음 질문에 답해 주세요.' },
                { word: 'Vocabulary', pron: '[vəˈkæb.jə.lər.i]', meaning: '어휘', example: 'I need to study my English vocabulary.', exampleMeaning: '나는 나의 영어 어휘를 공부해야 합니다.' },
                { word: 'Grammar', pron: '[ˈɡræm.ər]', meaning: '문법', example: 'Grammar is important for writing.', exampleMeaning: '문법은 쓰기에 있어서 중요합니다.' },
            ]);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">시험지로 배우기</h2>
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex flex-col items-center justify-center cursor-pointer"
                >
                    <UploadCloud size={48} className="text-blue-500 mb-4" />
                    {file ? (
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{file.name} 선택됨!</p>
                    ) : (
                        <>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">여기에 시험지 사진을 끌어다 놓으세요</p>
                            <p className="text-sm text-gray-400">이미지의 영단어를 텍스트로 인식합니다</p>
                        </>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleStart}
                        disabled={!file || isAnalyzing}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
                    >
                        {isAnalyzing ? '시험지 텍스트 인식 중...' : '시험지 텍스트 인식하기'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
