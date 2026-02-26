import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, Check, X, ShieldQuestion, ShieldCheck, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioButton from './AudioButton';
import ScoreModal from './ScoreModal';

export default function StudyArea({ data, onHome, onSaveRecord }) {
    const [isTestMode, setIsTestMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState([]); // { word, isCorrect }
    const [isRevealed, setIsRevealed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // 테스트 모드 전용 입력 상태 관련
    const [userInput, setUserInput] = useState('');
    const [evalStatus, setEvalStatus] = useState(null); // 'correct' | 'wrong' | null
    const inputRef = useRef(null);

    const currentItem = data ? data[currentIndex] : null;

    useEffect(() => {
        if (isTestMode && !isRevealed && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentIndex, isTestMode, isRevealed]);

    const handleToggleMode = () => {
        setIsTestMode(!isTestMode);
        setCurrentIndex(0);
        setResults([]);
        setIsRevealed(false);
        setShowModal(false);
        setUserInput('');
        setEvalStatus(null);
    };

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(curr => curr + 1);
            setIsRevealed(false);
            setUserInput('');
            setEvalStatus(null);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(curr => curr - 1);
            setIsRevealed(false);
            setUserInput('');
            setEvalStatus(null);
        }
    };

    const handleCheckAnswer = (e) => {
        if (e) e.preventDefault();
        if (isRevealed || !userInput.trim()) return;

        // 대소문자 무시 비교
        const isCorrect = userInput.trim().toLowerCase() === currentItem.word.toLowerCase();
        setEvalStatus(isCorrect ? 'correct' : 'wrong');
        setIsRevealed(true);

        // 0.5초 대기 후 자동으로 다음/모달(결과 처리)로 넘어가게 함.
        setTimeout(() => {
            handleAnswer(isCorrect);
        }, 1500);
    };

    const handleAnswer = (isCorrect) => {
        const newResults = [...results, { word: currentItem.word, isCorrect }];
        setResults(newResults);

        if (currentIndex < data.length - 1) {
            setCurrentIndex(curr => curr + 1);
            setIsRevealed(false);
            setUserInput('');
            setEvalStatus(null);
        } else {
            const correctCount = newResults.filter(r => r.isCorrect).length;
            onSaveRecord({
                date: new Date().toISOString(),
                total: data.length,
                correct: correctCount,
                ratio: correctCount / data.length
            });
            setShowModal(true);
        }
    };

    const handleRetryTest = () => {
        setCurrentIndex(0);
        setResults([]);
        setIsRevealed(false);
        setShowModal(false);
        setUserInput('');
        setEvalStatus(null);
    };

    // 예문에서 단어 부분만 블러/밑줄 처리하는 헬퍼 함수
    const renderExample = (example, word, isTest, revealed) => {
        if (!example) return null;
        if (!isTest || revealed) return <span>{example}</span>;

        // 단순 무식한 대소문자 무시 치환 (정규식)
        const regex = new RegExp(`(${word})`, 'gi');
        const parts = example.split(regex);

        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === word.toLowerCase() ? (
                        <span key={i} className="filter blur-sm select-none mx-1 opacity-50 bg-gray-300 dark:bg-gray-600 px-2 rounded-md">
                            {part}
                        </span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    if (!data || data.length === 0) {
        return <div className="text-center p-10">데이터가 없습니다.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6 px-2">
                <button onClick={onHome} className="flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    <ArrowLeft size={20} className="mr-2" /> 나가기
                </button>

                {/* 테스트 모드 토글 */}
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => { if (isTestMode) handleToggleMode(); }}
                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center transition-colors ${!isTestMode ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <ShieldQuestion size={16} className="mr-2" /> 학습 모드
                    </button>
                    <button
                        onClick={() => { if (!isTestMode) handleToggleMode(); }}
                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center transition-colors ${isTestMode ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <ShieldCheck size={16} className="mr-2" /> 테스트 모드
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 relative min-h-[450px] flex flex-col justify-center">
                {/* 진행률 바 */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-700">
                    <motion.div
                        className={`h-full ${isTestMode ? 'bg-purple-500' : 'bg-blue-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-6 sm:p-12 text-center h-full flex flex-col items-center justify-center space-y-6">
                    <div className="w-full flex justify-between items-center text-gray-400 dark:text-gray-500 font-medium text-sm">
                        <span>단어 {currentIndex + 1} / {data.length}</span>
                        {isTestMode && <span>테스트 진행 중</span>}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex + (isRevealed ? '-revealed' : '')}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center space-y-6 w-full"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <h1 className={`text-5xl sm:text-7xl font-black transition-all duration-300 ${isTestMode && !isRevealed
                                    ? 'filter blur-[12px] select-none text-gray-400 dark:text-gray-600'
                                    : evalStatus === 'correct'
                                        ? 'text-green-500'
                                        : evalStatus === 'wrong'
                                            ? 'text-red-500'
                                            : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {currentItem.word}
                                </h1>
                                {/* 발음 버튼은 테스트 모드여도 지우지 않음! */}
                                <AudioButton text={currentItem.word} />
                            </div>

                            {/* 테스트 폼 */}
                            {isTestMode && (
                                <form onSubmit={handleCheckAnswer} className="w-full max-w-sm mt-4 relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        disabled={isRevealed}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="들려주는 단어를 적어보세요!"
                                        className={`w-full px-6 py-4 text-center text-2xl font-bold rounded-2xl border-4 transition-all outline-none 
                      ${evalStatus === 'correct'
                                                ? 'border-green-400 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/30'
                                                : evalStatus === 'wrong'
                                                    ? 'border-red-400 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/30'
                                                    : 'border-purple-200 focus:border-purple-500 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white dark:focus:border-purple-400'
                                            }
                    `}
                                    />
                                    {!isRevealed && (
                                        <button type="submit" className="absolute right-3 top-3 bottom-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-4 flex items-center justify-center transition-colors">
                                            <CornerDownLeft size={20} />
                                        </button>
                                    )}
                                    {evalStatus === 'correct' && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 bg-green-500 text-white rounded-full p-2">
                                            <Check size={24} strokeWidth={4} />
                                        </motion.div>
                                    )}
                                    {evalStatus === 'wrong' && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-4 bg-red-500 text-white rounded-full p-2">
                                            <X size={24} strokeWidth={4} />
                                        </motion.div>
                                    )}
                                </form>
                            )}

                            {(!isTestMode || isRevealed) && (
                                <div className="flex flex-col items-center gap-2 mt-2">
                                    <div className="text-xl sm:text-2xl text-blue-500 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl">
                                        {currentItem.pron}
                                    </div>
                                </div>
                            )}

                            {/* 단어 뜻은 테스트 모드에서도 유추할 수 있도록 항상 표기 */}
                            {currentItem.meaning && (
                                <div className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 font-bold mt-2">
                                    {currentItem.meaning}
                                </div>
                            )}

                            {/* 예시 문장 영역 */}
                            {currentItem.example && (
                                <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl w-full border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase tracking-wider">Example</p>
                                        <p className="text-lg text-gray-800 dark:text-gray-200 italic leading-relaxed">
                                            "{renderExample(currentItem.example, currentItem.word, isTestMode, isRevealed)}"
                                        </p>
                                        {/* 예문 뜻은 항상 노출 */}
                                        {currentItem.exampleMeaning && (
                                            <p className="text-md text-gray-600 dark:text-gray-400 mt-3 font-medium">
                                                {currentItem.exampleMeaning}
                                            </p>
                                        )}
                                    </div>
                                    {/* 예문에서 발음 듣기 버튼 역시 항상 유지 */}
                                    <div className="mt-2 sm:mt-6 sm:ml-auto">
                                        <AudioButton text={currentItem.example} className="" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6">
                {!isTestMode && (
                    <>
                        <button
                            onClick={handlePrev} disabled={currentIndex === 0}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-bold disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        >이전</button>
                        <button
                            onClick={handleNext} disabled={currentIndex === data.length - 1}
                            className="px-8 py-3 bg-blue-500 text-white rounded-full font-bold disabled:opacity-50 hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                        >다음 단어</button>
                    </>
                )}
            </div>

            <ScoreModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                total={data.length}
                correct={results.filter(r => r.isCorrect).length}
                onRetry={handleRetryTest}
                onHome={onHome}
            />
        </div>
    );
}
